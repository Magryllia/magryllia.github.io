---
title: 【UE5】Volumetric Fogを有効化してもライトシャフト（ゴッドレイ）ができないときの対処法
date: 2023-11-25T14:05:29+09:00
tags: UE
categories: blog
# cover_index: /assets/how-to-fix-volumetric-fog-problem/450.webp
hidden: true
---

## 起こっている問題
ExponentioalHeightFogのVolumetricFogを有効化したのに全体的にFogが濃くなるだけで、ライトシャフトができない...
![](2023-11-25T141219.png)

## 結論
Directional Lightの設定でCast Ray Traced Shadowsが有効化されていたことが原因だった
![](2023-11-25T141419.png)

無効化すると無事ライトシャフトが作られた
![](2023-11-25T141621.png)