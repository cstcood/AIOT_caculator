# AIOT_caculator

函数绘图与求最小，可自由使用做二次开发适配，后续可以开源也可以闭源，但是不能用于商业化。



## 适配

Xiaomi Smart Band 10 测试通过

其它手表等 绘图可能会发生偏移（css 太麻烦了摆了）

## 功能
通过拟牛顿法对输入的函数进行求最小
使用chart进行绘图

## 输入

### 求最小

函数表达式:初始x0 (可选 默认为0)

如
```
xln(x):0.5
```

### 绘图

函数表达式:x绘图范围最小值(可选 默认0):x绘图范围最大值(可选 默认0):x步长(可选 默认0.2):y绘图范围最小值(可选 默认当前范围函数最小值):y绘图范围最大值(可选 默认当前范围函数最大值)

如
```
ln(X)/sin(X):0:1:0.1:0:2
```

代码里面加入了最小最大的判断，即使参数写反了也不会出现死循环


## 参数说明

### 合法函数表达式
乘法时，数字与函数之间, 函数与函数之间，符号与函数直接 用*相连 如

```
X*cos(X)

3*X

e*ln(X)

pi*X
```
### 其它参数

只允许数值，不能出现函数表达式

### 补充

函数左右括号需要匹配，运算符括号也需要匹配

ps 部分支持形如 数字与函数不加`*`的形式如 `3cos(X)` 但对于形如 `Xln(X)` 仍存在BUG   

### 拟牛顿法

| 参数      | 数值 |
| ----------- | ----------- |
| $x_0$      | 0       |
| $\epsilon$      | $10^{-6}$       |
| maxIter  | 100        |


## 可能存在的BUG

底版来自官方示例demo 代码部分变量命名同官方demo没改，一些多余css样式和代码没删，摆了。

绘图的时候的样式 最标轴可能会偏移 在数值特别大的时候显示会偏移 Xiaomi Smart Band 10 测试通过

css 条件太多，适配太麻烦了摆了

## 参考

欢迎使用快应用-Vela计算器模板

https://github.com/open-vela/packages_fe_examples/tree/dev/multi-screen-calculator

官方chart

https://github.com/open-vela/packages_fe_examples/tree/dev/chart

## 协议
```
Copyright (c) 2025

This software  is licensed for personal, non-commercial use only.
You may not use this software, in whole or in part, for commercial purposes 
without explicit written permission from the author.

Commercial purposes include but are not limited to:
- Selling or distributing the software
- Using the software in a product or service for which you charge fees
- Using the software in a business or organization for profit
```



