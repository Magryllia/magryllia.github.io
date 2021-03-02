---
title: 【Houdini】VDB Morph SDFでトポロジー無視のモーフィングを行う
date: 2021-03-01T21:34:43+09:00
tags: Houdini
categories: blog
#cover_index: /assets/VDBMorphSDF/450.webp
hidden: true
---

![eyecatch](/assets/VDBMorphSDF/01.webp)

## 目次
<!-- toc -->

## はじめに

無性にジオメトリをモーフさせたくなるときってあるよね．  
冒頭の画像を作るときに初めてVDBMorphSDFを使ったので使い方をメモっておく．  
↓本記事ではサンプルとしてこれを作る ([サンプルデータ](https://github.com/Magryllia/VDBMorphSDF_Sample))
![morph](morph.png)

## メッシュのVDB化
PigHeadとTemplateHeadを配置してVDBに変換する．今回はVoxel Sizeを0.005とした．  
TransformとPolyFillはスケールとメッシュを調整するためのもの．~テストジオメトリのスケールぐらい揃えといてくれよ~

![2021-03-01T215814](2021-03-01T215814.png)
![2021-03-01T215930](2021-03-01T215930.png)


## モーフのシミュレーション
Solverに2つのVDBを接続する．

![2021-03-01T220059](2021-03-01T220059.png)

Allow Chaching To Diskにチェックを入れておくとシミュレーション結果がメモリの上限値を超えてもディスクに保存してくれる．ここではチェックを入れておく．

![2021-03-01T221444](2021-03-01T221444.png)

Solver内でVDBMorphSDF ([公式ヘルプ](https://www.sidefx.com/ja/docs/houdini/nodes/sop/vdbmorphsdf)) にPrev_FrameとInput_2を接続する．プロパティは触らない．

![2021-03-01T220626](2021-03-01T220626.png)

Solverに表示フラグを立てて1からフレームを進めるとモーフのシミュレーションが計算される．

![morph01](morph01.webp)

しかし今回はモーフが完了する前にフレームの最後 (240frame) にたどり着いてしまった．この解決法は以下の3つ (他にもあるかも)  

- FENDを伸ばす
- Solver プロパティのSub Stepsを増やす
- VDBMorphSDF プロパティのTimeStepを増やす
<br>

どれでもいいけど，今回は2番目の方法で行う．Sub Stepsを3にして再度計算を行う． (当然1フレームあたりの計算量は多くなる)  

![2021-03-02T210704](2021-03-02T210704.png)

これで最後までモーフするようになった．

![morph02](morph02.webp)

File Chacheを繋いでSave To Diskし，計算結果を保存しておく．今回はたまたまフレームの最後でモーフが完了したので保存するFrame Rangeはデフォルト値のままだが，もっと早く終わったならそれに応じて保存期間も短くしたほうがディスクを無駄に消費せずに済むと思う．

![2021-03-01T232539](2021-03-01T232539.png)

![2021-03-01T232729](2021-03-01T232729.png)

保存したらLoad From Diskにチェックを入れておく．

![2021-03-01T233149](2021-03-01T233149.png)

## モーフをパラメータから制御する

現在はフレームによってモーフィングしているが，これをパラメータから制御できるようにしたい．  
まず制御用のNullを作成し，morphという名前の0~1のfloatパラメータを追加する．

![2021-03-01T233736](2021-03-01T233736.png)

次にTime Shift ([公式ヘルプ](https://www.sidefx.com/ja/docs/houdini/nodes/sop/timeshift)) を接続する．

![2021-03-01T233929](2021-03-01T233929.png)

これは入力ジオメトリの任意の時間での状態を出力するノード．デフォルトではFrameに`$F`が入っているため，現在のフレームのジオメトリの状態がそのまま出力される．

![2021-03-01T234136](2021-03-01T234136.png)

このFrameの値を以下に書き換える．

```
fit(ch("../Controller/morph"), 0, 1, $FSTART, $FEND)
```

Controller morphパラメータの値 (0～1) とシミュレーションの初めから終わり (FSTART～FEND) をfit ([公式ヘルプ](https://www.sidefx.com/ja/docs/houdini/vex/functions/fit.html))で対応させているので，morphパラメータに応じてモーフするようになった．

![morph](morph.png)

最後にConvert VDBでメッシュ化すれば完成．

![2021-03-01T235750](2021-03-01T235750.png)

これでモーフは出来るようになった．


## おわりに
厳密に言うとSolverの1フレーム目から既にモーフが始まっているため，morphパラメータを0にしていても若干 (変形シミュレーション1フレーム分) 形が崩れていたりする．  
これに関してはSolverのStart Frameを2にして`$F = 1`のときだけswitchで変形元のVDBをキャッシュに出力するとか工夫が要る．  

あとモーフの変化量がステップで等しくないため，初めらへんは急激にモーフして最後らへんはゆっくりめになる． (モーフするジオメトリにもよるが)  
そのためモーフに緩急をつけたアニメーションを付けたいときとかはこのままだとちょっと面倒かも．  
`fit(pow(ch("../Controller/morph"), 1.5), 0, 1, $FSTART, $FEND)` みたいにコントローラの値を補正してやるといいかも．

## 関連・参考文献
- [Houdini Tutorial - 3D Object Morphing using Open VDB Morph and SOP Solver](https://youtu.be/-ycX38_DV7E)  
- [VDBでブレンドシェイプ的なやつをやる](https://wakumoku.com/2021/02/06/vdb%e3%81%a7%e3%83%96%e3%83%ac%e3%83%b3%e3%83%89%e3%82%b7%e3%82%a7%e3%82%a4%e3%83%97%e7%9a%84%e3%81%aa%e3%82%84%e3%81%a4%e3%82%92%e3%82%84%e3%82%8b/)