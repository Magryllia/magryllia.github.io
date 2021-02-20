---
title: 【Houdini】Attribute Transferで転送した値がボケない時の対処法
date: 2021-02-20T18:58:38+09:00
tags: 
categories: blog
#cover_index: /assets/AttributeTransfer/450.webp
hidden: true
---

## 現象
自分でCreateしたAttributeをAttribute Transferで別のジオメトリに転送しようとしたら，  
転送された値が0/1でパッキリしてしまった．Attribute TransferのBlend Width等のパラメータを変えても変化なし．なんでや．

![2021-02-20T190208](2021-02-20T190208.png)

## 解決策
[公式のサンプル](https://www.sidefx.com/ja/docs/houdini/examples/nodes/sop/attribtransfer/TransferColor.html)を見たところ，転送される側のジオメトリにも同じAttributeを作っておかないといけないらしい．（当然この場合値は0にする）  

![2021-02-20T191507](2021-02-20T191507.png)