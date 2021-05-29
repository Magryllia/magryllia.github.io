---
title: 【Houdini】UV Layout SOPでジオメトリを綺麗に敷き詰めてモーフさせる
date: 2021-05-29T13:52:20+09:00
tags: Houdini
categories: blog
#cover_index: /assets/Moprh_UVLayout/450.webp
hidden: true
---

<img src="/assets/BetterHarderStronger/01.webp" width="500px" height="500px">

これを作るよ．

## 目次
<!-- toc -->

## はじめに
大まかな流れは目次の通り．  
プロジェクトファイルは[こちら](https://github.com/Magryllia/TypoMorph01)  
細かい説明は割愛するのでファイルを見てね．**なお[MOPs](https://www.motionoperators.com/)を使用しているのでファイルを見たい人は導入してね**  
全体像は以下  
![2021-05-29T144430](2021-05-29T144430.png)

## ピースとガイドジオメトリを用意
ピースとなるジオメトリをFontで用意する．  
原点に適当に点を作って[Attribute Randomize](https://www.sidefx.com/ja/docs/houdini/nodes/sop/attribrandomize.html)でpscaleとorientを散らす．  
できればA～Zを個別に作りたかったけど，方法がわからなかったのでFontのTextにA～Zをそのまま打ち込んだ．

![2021-05-29T144528](2021-05-29T144528.png)

その後[Connectivity](https://www.sidefx.com/ja/docs/houdini/nodes/sop/connectivity.html)で文字ごとにピースを分け，着色したり[Assemble](https://www.sidefx.com/ja/docs/houdini/nodes/sop/assemble)でピースごとにパックしたりする．

![2021-05-29T144657](2021-05-29T144657.png)

今回ガイドジオメトリにもFontを使用したが，平たいものなら何でも大丈夫．

![2021-05-29T144733](2021-05-29T144733.png)

## UV Layoutでピースを敷き詰める

[UV Layout](https://www.sidefx.com/ja/docs/houdini/nodes/sop/uvlayout.html)は本来はその名の通りUVをきれいに敷き詰めるSOPだが，応用すると平たいサーフェスにも敷き詰められる．

![2021-05-29T145706](2021-05-29T145706.png)

設定項目はこんな感じ．ピースジオメトリとガイドジオメトリを接続し，Islands To PackのUV AttributeとTargetsのUV AttributeにPを設定し，Pack IntoをIslands From Second Inputにするとガイドジオメトリの中にピースジオメトリが敷き詰められる．  
Island Rotation StepやIterarionsなどを変更し望む絵が得られるよう調整する．

![2021-05-29T150151](2021-05-29T150151.png)

本機能について詳しく知りたい人は[Entagma氏のチュートリアル](https://youtu.be/U-Y38fwuO38)を参照．

## Extract Transformでトランスフォーム情報を取得
[Extract Transform](https://www.sidefx.com/ja/docs/houdini/nodes/sop/extracttransform)は同じ形状の2つのジオメトリを比較し，どう変形したか（トランスフォーム情報）を返すノード．  
Connectivityで設定したPiece Attributeを指定するとピースごとにトランスフォーム情報を持ったポイントが得られる．

![2021-05-29T151150](2021-05-29T151150.png)
![2021-05-29T151205](2021-05-29T151205.png)

ちなみにここで得られたポイントとピースを後に使う[Transform Pieces](https://www.sidefx.com/ja/docs/houdini/nodes/sop/xformpieces)に接続するとUV Layoutで敷き詰めた状態が復元され，正しくポイントにトランスフォーム情報が入っていることがわかる．

![2021-05-29T151547](2021-05-29T151547.png)

## Blend ShapesやCHOPで各状態をモーフ
上記工程で得られたBetter Harder Strongerの3つの文字をモーフさせる．  
先にBlend Shapesについて説明すると，Primitive ID AttributeにConnectivityで設定したclassを指定することで同一ピース文字間のモーフが可能になる．

![blendShapes](blendShapes.apng)

今回は文字の端から遷移していく動きを作るにあたり，無料のSideFX公式(?)ツールの[MOPs](https://www.motionoperators.com/)を用いた．無くても作れそうだけどこれ使ったほうが個人的に楽．  

MOPs Shape Falloffで左から0→1と変化するフォールオフアトリビュートを作成する．  
PreView Falloffにチェックすると色でフォールオフを確認できる．

![2021-05-29T153737](2021-05-29T153737.png)

その後Transformで各文字をいい感じの位置に移動させる．

![2021-05-29T155103](2021-05-29T155103.png)

これをモーフ後のポイント群として使いたいため，モーフ前のポイント群に[Attribute Copy](https://www.sidefx.com/ja/docs/houdini/nodes/sop/attribcopy)で転送する．  
**このときにMOPs Shape Falloffで生成されるi@idも一緒に転送しておかないと後のMOPs Delayで正常に動作しないので注意．**

![2021-05-29T154301](2021-05-29T154301.png)

Blend Shapeのblend値にキーフレームを打ってMOPs Dedayを見るとBetter→Harderに左から文字が組み上がっている．  
これは右側のほうがフォールオフ値が大きく動きが遅延しているため．

![](MopsDelay.apng)

以上のモーフをBetter→Harder/Harder→Stronger/Stronger→Betterの3つ作る．（といっても残り2つはコピペするだけ）  
3つのモーフを繋げるためにCHOPsを使用する．  

![2021-05-29T160553](2021-05-29T160553.png)

ジオメトリの情報をCHOPに持ってくるためには[Geometry CHOP](https://www.sidefx.com/ja/docs/houdini/nodes/chop/geometry.html)を用いる．  
GeometryでSOP階層のインポート元を指定し，P orient pscaleを持ってくる．  
[Trim](https://www.sidefx.com/ja/docs/houdini/nodes/chop/trim)でそれぞれチャンネルをモーフの始まりから終わりまでに切って[Sequence](https://www.sidefx.com/ja/docs/houdini/nodes/chop/sequence)でその3つのチャンネルを1つに直列に繋げ，Cycleで動きをループさせる．  
Sequenceについては[このサンプル](https://www.sidefx.com/ja/docs/houdini/examples/nodes/chop/sequence/AnimationSequence.html)がわかりやすい．

![2021-05-29T160439](2021-05-29T160439.png)
![2021-05-29T160747](2021-05-29T160747.png)

[Channel](https://www.sidefx.com/ja/docs/houdini/nodes/sop/channel)でCHOPのチャンネルをSOPで参照できる．  
Geometry, Channel共にMethodをAnimatedにしないと動いているチャンネルは正常に処理できないので注意．  

![2021-05-29T161639](2021-05-29T161639.png)

## Transform Piecesでピースを復元

[Transform Pieces](https://www.sidefx.com/ja/docs/houdini/nodes/sop/xformpieces)に動かしたいジオメトリ（ここでは小さい文字）とテンプレートポイントを接続し，マッチングさせるアトリビュート（ここではclass）を指定すると，一致するアトリビュートを持ったジオメトリがポイント上にトランスフォームする．
![2021-05-29T163030](2021-05-29T163030.png)
![](TransformPieces.apng)

前述したが，ピース文字はそれぞれ[Assemble](https://www.sidefx.com/ja/docs/houdini/nodes/sop/assemble)でパックしたほうが処理が早い．

![2021-05-29T163355](2021-05-29T163355.png)

## Time Shiftで位相をずらして合成
[TimeShift](https://www.sidefx.com/ja/docs/houdini/nodes/sop/timeshift)で適当にモーフィングをオフセットして元とマージすればジオメトリは出来上がり．

![2021-05-29T163530](2021-05-29T163530.png)
![2021-05-29T163618](2021-05-29T163618.png)

## マテリアルとレンダリング
ライティングの影響を受けないようにするためにConstantマテリアルを背景と文字に割り当てる．  
プロパティはデフォルトのまま．

![2021-05-29T163906](2021-05-29T163906.png)
![2021-05-29T172050](2021-05-29T172050.png)

ビューポートの絵面をそのままレンダリングしたいときは[OpenGL ROP](https://www.sidefx.com/ja/docs/houdini/nodes/out/opengl)を使う．  
レンダリングしてみると色味が変わってしまったときはおそらくACES(OpenColorIO)かガンマ値が悪さしているのでビューやレンダラの設定を見てみると良い．  

## おわりに
UV Layout SOPは色々使えそうで夢が広がるのでよい．

## 参考・関連文献
- [MOPs: Motion Operators for Houdini導入のメモ | shujihirai](https://note.com/shujihirai/n/nd3c8edd2e731)
- [Houdini 17 Quicktip: (Ab)Using The UV Layout SOP For Geometry Packing](https://youtu.be/U-Y38fwuO38)