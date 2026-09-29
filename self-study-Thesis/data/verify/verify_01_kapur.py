"""Kiểm chứng các con số tự tính trong Module 01 từ Bảng 1 và 2 của Kapur (2014)."""
from math import sqrt
def d(m1,s1,n1,m2,s2,n2):
    sp = sqrt(((n1-1)*s1**2+(n2-1)*s2**2)/(n1+n2-2)); return sp,(m1-m2)/sp
sp,dv = d(6.33,1.25,37,3.84,1.24,38); print("Study1 khái niệm: sp=%.3f d=%.2f (bài báo: d=2.00)"%(sp,dv))
sp,dv = d(5.37,1.46,37,3.11,1.51,38); print("Study1 chuyển giao: sp=%.3f d=%.2f (bài báo: d=1.52)"%(sp,dv))
print("r^2 (r=.82)=%.4f ; r^2 (r=.88)=%.4f"%(.82**2,.88**2))
