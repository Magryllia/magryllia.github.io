---
title: 【Houdini】エッジ上のポイントを削除する(Facetノード)
date: 2022-07-29T19:01:42+09:00
tags: Houdini
categories: blog
# cover_index: /assets/Remove_Inline_Points/450.webp
hidden: true
---

## やりたいこと

下図左のように直線のエッジ上にあるポイントを削除したい。
要するにResampleの逆を行いたい。

![2022-07-29T190257](2022-07-29T190257.png)


## 方法

[Facetノード](https://www.sidefx.com/ja/docs/houdini/nodes/sop/facet)を接続し、「Remove Inline Points」を有効にするとエッジ上のポイントが削除される。
>ヘルプページの説明：
>Remove Inline Points
>ポイントが前と次のポイントを結んだ直線上に並んでいた場合に、ポリゴンからそれらのポイントを削除します。

![2022-07-29T190739](2022-07-29T190739.png)


また、Distanceパラメータを大きくすると直線に並んでいないポイントも削除される。

![](distance.webp)