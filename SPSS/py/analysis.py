"""
Bộ lõi thống kê cho "SPSS-Lite bằng Python" — chạy hoàn toàn trong trình duyệt qua Pyodide.
Toàn bộ hàm nhận/trả JSON (chuỗi) để gọi thẳng từ JavaScript, không phụ thuộc thư viện
ngoài numpy / pandas / scipy / statsmodels (đều là gói chính thức của Pyodide, tải qua
micropip.loadPackage lúc khởi động nên không cần cài thêm gì ở máy người dùng).

Tư duy chẩn đoán (diagnostic thinking) được lập trình cứng vào các hàm kiểm định:
trước khi kết luận, luôn kiểm tra giả định (Shapiro-Wilk cho tính chuẩn, Levene cho
đồng nhất phương sai) rồi tự động rẽ nhánh sang kiểm định phi tham số / Welch khi
giả định bị vi phạm — đúng tinh thần "Rủi ro của thống kê nút bấm" trong bài giảng.
"""
import json
import numpy as np
import pandas as pd
from scipy import stats

ALPHA_ASSUMPTION = 0.05  # ngưỡng ý nghĩa dùng để xét vi phạm giả định


def _clean(x):
    """Ép các kiểu numpy/NaN về kiểu JSON-serializable."""
    if isinstance(x, (np.floating, float)):
        x = float(x)
        return None if np.isnan(x) else round(x, 6)
    if isinstance(x, (np.integer, int)):
        return int(x)
    if isinstance(x, (np.bool_, bool)):
        return bool(x)
    if isinstance(x, dict):
        return {k: _clean(v) for k, v in x.items()}
    if isinstance(x, (list, tuple)):
        return [_clean(v) for v in x]
    return x


def _df_from_records(records_json):
    records = json.loads(records_json)
    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# 0. NẠP DỮ LIỆU — dùng pandas.read_csv để tận dụng bộ phân tích CSV bền bỉ
#    (xử lý đúng dấu phẩy trong chuỗi có dấu ngoặc kép, BOM, v.v.) thay vì tự
#    viết parser CSV bằng tay ở phía JavaScript.
# ---------------------------------------------------------------------------
def parse_csv_text(csv_text):
    import io
    csv_text = csv_text.lstrip("﻿")  # phòng trường hợp BOM không được trình duyệt tự loại bỏ
    df = pd.read_csv(io.StringIO(csv_text))
    df.columns = [str(c).strip().lstrip("﻿") for c in df.columns]

    columns_meta = []
    for c in df.columns:
        numeric = pd.to_numeric(df[c], errors="coerce")
        is_numeric = numeric.notna().sum() >= max(1, int(0.8 * df[c].notna().sum()))
        n_unique = int(df[c].nunique(dropna=True))
        # Đoán loại thang đo mặc định — người dùng có thể sửa lại ở Variable View
        if is_numeric:
            suggested = "ratio" if n_unique > 7 else "ordinal"
        else:
            suggested = "nominal"
        columns_meta.append({
            "name": c,
            "is_numeric": bool(is_numeric),
            "n_unique": n_unique,
            "n_missing": int(df[c].isna().sum()),
            "suggested_scale": suggested,
            "sample_values": [str(v) for v in df[c].dropna().unique()[:5].tolist()],
        })

    return json.dumps({
        "n_rows": int(len(df)),
        "columns": columns_meta,
        "records": json.loads(df.to_json(orient="records")),
    })


# ---------------------------------------------------------------------------
# 1. THỐNG KÊ MÔ TẢ (Auto-EDA rút gọn, thay cho "Descriptive Statistics" SPSS)
# ---------------------------------------------------------------------------
def describe_numeric(records_json, columns_json):
    df = _df_from_records(records_json)
    cols = json.loads(columns_json)
    out = {}
    for c in cols:
        s = pd.to_numeric(df[c], errors="coerce")
        n_total = len(s)
        n_valid = int(s.notna().sum())
        desc = {
            "N": n_valid,
            "missing": n_total - n_valid,
            "missing_pct": round((n_total - n_valid) / n_total * 100, 2) if n_total else None,
            "mean": _clean(s.mean()),
            "std": _clean(s.std()),
            "min": _clean(s.min()),
            "max": _clean(s.max()),
            "median": _clean(s.median()),
            "skew": _clean(s.skew()),
            "kurtosis": _clean(s.kurtosis()),
        }
        if n_valid >= 3:
            try:
                w, p = stats.shapiro(s.dropna())
                desc["shapiro_W"] = _clean(w)
                desc["shapiro_p"] = _clean(p)
                desc["normal_ok"] = bool(p > ALPHA_ASSUMPTION)
            except Exception:
                desc["shapiro_W"] = None
                desc["shapiro_p"] = None
                desc["normal_ok"] = None
        out[c] = desc
    return json.dumps(_clean(out))


def correlation_matrix(records_json, columns_json, method="pearson"):
    df = _df_from_records(records_json)
    cols = json.loads(columns_json)
    sub = df[cols].apply(pd.to_numeric, errors="coerce")
    corr = sub.corr(method=method)
    return json.dumps({
        "columns": cols,
        "matrix": _clean(corr.values.tolist()),
        "method": method,
    })


# ---------------------------------------------------------------------------
# 2. KIỂM ĐỊNH GIẢ THUYẾT CÓ RẼ NHÁNH CHẨN ĐOÁN
# ---------------------------------------------------------------------------
def independent_ttest(records_json, value_col, group_col):
    """So sánh 2 nhóm độc lập — tự động Levene -> Welch/Student; Shapiro -> gợi ý Mann-Whitney."""
    df = _df_from_records(records_json)
    df[value_col] = pd.to_numeric(df[value_col], errors="coerce")
    groups = df[group_col].dropna().unique().tolist()
    if len(groups) != 2:
        return json.dumps({"error": f"Biến nhóm phải có đúng 2 nhóm, hiện có {len(groups)}: {groups}"})

    g1 = df.loc[df[group_col] == groups[0], value_col].dropna()
    g2 = df.loc[df[group_col] == groups[1], value_col].dropna()

    result = {
        "group_labels": [str(groups[0]), str(groups[1])],
        "n": [int(len(g1)), int(len(g2))],
        "mean": [_clean(g1.mean()), _clean(g2.mean())],
        "std": [_clean(g1.std()), _clean(g2.std())],
    }

    # Bước chẩn đoán 1: tính chuẩn
    normal_ok = True
    shapiro_p = []
    for g in (g1, g2):
        if len(g) >= 3:
            _, p = stats.shapiro(g)
            shapiro_p.append(_clean(p))
            if p < ALPHA_ASSUMPTION:
                normal_ok = False
        else:
            shapiro_p.append(None)
    result["shapiro_p"] = shapiro_p
    result["normal_ok"] = normal_ok

    # Bước chẩn đoán 2: đồng nhất phương sai (Levene)
    levene_stat, levene_p = stats.levene(g1, g2)
    equal_var = levene_p >= ALPHA_ASSUMPTION
    result["levene_stat"] = _clean(levene_stat)
    result["levene_p"] = _clean(levene_p)
    result["equal_var_ok"] = bool(equal_var)

    # Rẽ nhánh quyết định
    if not normal_ok:
        stat, p = stats.mannwhitneyu(g1, g2, alternative="two-sided")
        result["method_used"] = "Mann-Whitney U (dữ liệu không chuẩn)"
        result["statistic"] = _clean(stat)
        result["p_value"] = _clean(p)
    elif not equal_var:
        stat, p = stats.ttest_ind(g1, g2, equal_var=False)
        result["method_used"] = "Welch's t-test (phương sai không đồng nhất)"
        result["statistic"] = _clean(stat)
        result["p_value"] = _clean(p)
    else:
        stat, p = stats.ttest_ind(g1, g2, equal_var=True)
        result["method_used"] = "Independent-samples t-test (Student)"
        result["statistic"] = _clean(stat)
        result["p_value"] = _clean(p)

    # Effect size (Cohen's d) luôn tính kèm để tham khảo
    pooled_std = np.sqrt(((len(g1) - 1) * g1.var() + (len(g2) - 1) * g2.var()) / (len(g1) + len(g2) - 2))
    cohens_d = (g1.mean() - g2.mean()) / pooled_std if pooled_std else None
    result["cohens_d"] = _clean(cohens_d)
    result["significant"] = bool(result["p_value"] is not None and result["p_value"] < ALPHA_ASSUMPTION)
    return json.dumps(_clean(result))


def paired_ttest(records_json, before_col, after_col):
    df = _df_from_records(records_json)
    before = pd.to_numeric(df[before_col], errors="coerce")
    after = pd.to_numeric(df[after_col], errors="coerce")
    valid = before.notna() & after.notna()
    before, after = before[valid], after[valid]
    diff = after - before

    result = {
        "n": int(len(diff)),
        "mean_before": _clean(before.mean()),
        "mean_after": _clean(after.mean()),
        "mean_diff": _clean(diff.mean()),
    }
    normal_ok = True
    if len(diff) >= 3:
        _, p_norm = stats.shapiro(diff)
        result["shapiro_p_diff"] = _clean(p_norm)
        normal_ok = p_norm >= ALPHA_ASSUMPTION
    result["normal_ok"] = normal_ok

    if normal_ok:
        stat, p = stats.ttest_rel(before, after)
        result["method_used"] = "Paired-samples t-test"
    else:
        stat, p = stats.wilcoxon(before, after)
        result["method_used"] = "Wilcoxon signed-rank test (hiệu số không chuẩn)"
    result["statistic"] = _clean(stat)
    result["p_value"] = _clean(p)
    result["significant"] = bool(p < ALPHA_ASSUMPTION)
    return json.dumps(_clean(result))


def one_way_anova(records_json, value_col, group_col):
    df = _df_from_records(records_json)
    df[value_col] = pd.to_numeric(df[value_col], errors="coerce")
    groups_data = [g.dropna().values for _, g in df.groupby(group_col)[value_col]]
    labels = [str(k) for k in df.groupby(group_col)[value_col].groups.keys()]

    if len(groups_data) < 2:
        return json.dumps({"error": "Cần ít nhất 2 nhóm để chạy ANOVA."})

    result = {
        "group_labels": labels,
        "n": [int(len(g)) for g in groups_data],
        "mean": [_clean(np.mean(g)) if len(g) else None for g in groups_data],
        "std": [_clean(np.std(g, ddof=1)) if len(g) > 1 else None for g in groups_data],
    }

    normal_ok = all(
        (len(g) < 3) or (stats.shapiro(g)[1] >= ALPHA_ASSUMPTION) for g in groups_data
    )
    levene_stat, levene_p = stats.levene(*groups_data)
    equal_var = levene_p >= ALPHA_ASSUMPTION
    result["normal_ok"] = bool(normal_ok)
    result["levene_p"] = _clean(levene_p)
    result["equal_var_ok"] = bool(equal_var)

    if not normal_ok:
        stat, p = stats.kruskal(*groups_data)
        result["method_used"] = "Kruskal-Wallis H test (dữ liệu không chuẩn)"
    elif not equal_var:
        stat, p = stats.f_oneway(*groups_data)  # xấp xỉ; ghi rõ khuyến nghị Welch ANOVA
        result["method_used"] = "One-way ANOVA (⚠ phương sai không đồng nhất — cân nhắc Welch ANOVA)"
    else:
        stat, p = stats.f_oneway(*groups_data)
        result["method_used"] = "One-way ANOVA (Fisher)"
    result["statistic"] = _clean(stat)
    result["p_value"] = _clean(p)
    result["significant"] = bool(p < ALPHA_ASSUMPTION)

    # Post-hoc Tukey HSD nếu có ý nghĩa và đủ điều kiện
    if result["significant"] and len(groups_data) > 2:
        try:
            from scipy.stats import tukey_hsd
            res = tukey_hsd(*groups_data)
            pairs = []
            k = len(labels)
            for i in range(k):
                for j in range(i + 1, k):
                    pairs.append({
                        "pair": f"{labels[i]} vs {labels[j]}",
                        "p_value": _clean(res.pvalue[i, j]),
                    })
            result["posthoc_tukey"] = pairs
        except Exception as e:
            result["posthoc_error"] = str(e)
    return json.dumps(_clean(result))


def correlation_test(records_json, x_col, y_col, method="pearson"):
    df = _df_from_records(records_json)
    x = pd.to_numeric(df[x_col], errors="coerce")
    y = pd.to_numeric(df[y_col], errors="coerce")
    valid = x.notna() & y.notna()
    x, y = x[valid], y[valid]
    if method == "spearman":
        r, p = stats.spearmanr(x, y)
    else:
        r, p = stats.pearsonr(x, y)
    return json.dumps(_clean({
        "n": int(len(x)), "r": r, "p_value": p, "method": method,
        "significant": bool(p < ALPHA_ASSUMPTION),
    }))


# ---------------------------------------------------------------------------
# 3. ĐỘ TIN CẬY THANG ĐO — Cronbach's Alpha
# ---------------------------------------------------------------------------
def cronbach_alpha(records_json, columns_json):
    df = _df_from_records(records_json)
    cols = json.loads(columns_json)
    sub = df[cols].apply(pd.to_numeric, errors="coerce").dropna()
    k = len(cols)
    if k < 2 or len(sub) < 2:
        return json.dumps({"error": "Cần ít nhất 2 biến và 2 quan sát hợp lệ."})
    item_vars = sub.var(axis=0, ddof=1)
    total_var = sub.sum(axis=1).var(ddof=1)
    alpha = (k / (k - 1)) * (1 - item_vars.sum() / total_var)

    # Alpha nếu loại từng item (Cronbach's Alpha if Item Deleted)
    if_deleted = {}
    for c in cols:
        rest = [x for x in cols if x != c]
        sub_r = sub[rest]
        kk = len(rest)
        iv = sub_r.var(axis=0, ddof=1)
        tv = sub_r.sum(axis=1).var(ddof=1)
        a = (kk / (kk - 1)) * (1 - iv.sum() / tv) if kk > 1 and tv else None
        if_deleted[c] = _clean(a)

    # Tương quan biến-tổng (corrected item-total correlation)
    item_total = {}
    total_score = sub.sum(axis=1)
    for c in cols:
        rest_total = total_score - sub[c]
        r, _ = stats.pearsonr(sub[c], rest_total)
        item_total[c] = _clean(r)

    interpretation = (
        "Rất tốt (≥0.9)" if alpha >= 0.9 else
        "Tốt (0.8–0.9)" if alpha >= 0.8 else
        "Chấp nhận được (0.7–0.8)" if alpha >= 0.7 else
        "Đáng ngờ (0.6–0.7)" if alpha >= 0.6 else
        "Kém (0.5–0.6)" if alpha >= 0.5 else "Không chấp nhận (<0.5)"
    )
    return json.dumps(_clean({
        "k_items": k, "n": int(len(sub)), "alpha": alpha,
        "interpretation": interpretation,
        "item_total_correlation": item_total,
        "alpha_if_deleted": if_deleted,
    }))


# ---------------------------------------------------------------------------
# 4. HỒI QUY & TRUNG GIAN (proxy nhẹ cho SEM/Path Model)
# ---------------------------------------------------------------------------
def ols_regression(records_json, y_col, x_cols_json):
    import statsmodels.api as sm
    df = _df_from_records(records_json)
    x_cols = json.loads(x_cols_json)
    data = df[[y_col] + x_cols].apply(pd.to_numeric, errors="coerce").dropna()
    X = sm.add_constant(data[x_cols])
    y = data[y_col]
    model = sm.OLS(y, X).fit()
    coefs = []
    for name in model.params.index:
        coefs.append({
            "term": name,
            "coef": _clean(model.params[name]),
            "std_err": _clean(model.bse[name]),
            "t": _clean(model.tvalues[name]),
            "p_value": _clean(model.pvalues[name]),
        })
    return json.dumps(_clean({
        "n": int(model.nobs), "r_squared": model.rsquared,
        "adj_r_squared": model.rsquared_adj, "f_p_value": model.f_pvalue,
        "coefficients": coefs,
    }))


def logistic_regression(records_json, y_col, x_cols_json):
    import statsmodels.api as sm
    df = _df_from_records(records_json)
    x_cols = json.loads(x_cols_json)
    data = df[[y_col] + x_cols].apply(pd.to_numeric, errors="coerce").dropna()
    X = sm.add_constant(data[x_cols])
    y = data[y_col]
    model = sm.Logit(y, X).fit(disp=0)
    coefs = []
    for name in model.params.index:
        coefs.append({
            "term": name,
            "coef": _clean(model.params[name]),
            "odds_ratio": _clean(np.exp(model.params[name])),
            "p_value": _clean(model.pvalues[name]),
        })
    return json.dumps(_clean({
        "n": int(model.nobs), "pseudo_r2": model.prsquared,
        "coefficients": coefs,
    }))


def mediation_baron_kenny(records_json, x_col, m_col, y_col):
    """
    Phân tích trung gian 3 bước (Baron & Kenny 1986) — proxy nhẹ, chạy hoàn toàn
    bằng OLS, cho mô hình dạng X -> M -> Y (đúng cấu trúc Ví dụ minh hoạ 2 của bài
    giảng: Môi trường Blended Learning -> Năng lực tự học -> Kết quả học tập).
    Không thay thế được SEM đầy đủ (semopy/AMOS/SmartPLS) khi có nhiều biến tiềm ẩn
    và chỉ số phù hợp mô hình (CFI/TLI/RMSEA) — xem mục Tự động hoá để lấy script
    semopy chạy offline trong Jupyter thật.
    """
    import statsmodels.api as sm
    df = _df_from_records(records_json)
    data = df[[x_col, m_col, y_col]].apply(pd.to_numeric, errors="coerce").dropna()
    X, M, Y = data[x_col], data[m_col], data[y_col]

    step1 = sm.OLS(Y, sm.add_constant(X)).fit()          # Y ~ X (c)
    step2 = sm.OLS(M, sm.add_constant(X)).fit()          # M ~ X (a)
    step3 = sm.OLS(Y, sm.add_constant(pd.DataFrame({x_col: X, m_col: M}))).fit()  # Y ~ X + M (c', b)

    a = step2.params[x_col]
    b = step3.params[m_col]
    c = step1.params[x_col]
    c_prime = step3.params[x_col]
    indirect = a * b

    # Sobel test cho ý nghĩa hiệu ứng gián tiếp
    se_a, se_b = step2.bse[x_col], step3.bse[m_col]
    se_indirect = np.sqrt(b ** 2 * se_a ** 2 + a ** 2 * se_b ** 2)
    z = indirect / se_indirect if se_indirect else None
    p_sobel = 2 * (1 - stats.norm.cdf(abs(z))) if z is not None else None

    mediation_type = (
        "Không có trung gian (a hoặc b không có ý nghĩa)"
        if step2.pvalues[x_col] >= ALPHA_ASSUMPTION or step3.pvalues[m_col] >= ALPHA_ASSUMPTION
        else "Trung gian toàn phần (c' không còn ý nghĩa)"
        if step3.pvalues[x_col] >= ALPHA_ASSUMPTION
        else "Trung gian một phần (c' vẫn có ý nghĩa nhưng nhỏ hơn c)"
    )

    return json.dumps(_clean({
        "path_c_total_effect": c, "path_c_p": step1.pvalues[x_col],
        "path_a_X_to_M": a, "path_a_p": step2.pvalues[x_col],
        "path_b_M_to_Y": b, "path_b_p": step3.pvalues[m_col],
        "path_c_prime_direct_effect": c_prime, "path_c_prime_p": step3.pvalues[x_col],
        "indirect_effect_ab": indirect,
        "sobel_z": z, "sobel_p": p_sobel,
        "conclusion": mediation_type,
    }))
