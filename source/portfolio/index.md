---
title: Portfolio
date: 2022-09-23 20:32:23
---

## VAT & Niagara
<!-- {% youtube mruCBrgPKAM %} -->
<iframe class="video" src="https://www.youtube.com/embed/mruCBrgPKAM?controls=1&color=white" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 概要
<table>
<tr>
    <td>使用ソフト</td>
    <td>Unreal Engine 5<br>Houdini</td>
</tr>
<tr>
    <td>制作期間</td>
    <td>2ヶ月</td>
</tr>
</table>
<br>

古代遺跡で遭遇する不可思議な現象をテーマにエフェクトを制作しました。
像の爆発に説得力が増すよう衝撃波や煙の表現の試行錯誤を重ねました。
エフェクト後半部ではVAT（頂点アニメーションテクスチャ）のシェーダを用いてNiagaraだけではできなかった物理演算と
パーティクルシステムの組み合わせの表現を実現しました。

### 天使像の破片エフェクト

#### Niagaraの問題点とHoudiniの活用による解決

本作品を制作するにあたり最大の課題はNiagaraを用いて天使像の破片の物理演算の表現とパーティクルシステムの表現を組み合わせることでした。
Niagaraは仕様上、一つのエミッタシステムに破片のような複数の形状のメッシュを割り当てることはできず、破片が飛び散るような複雑な物理演算も不向きです。
そこで、Houdiniを活用し以下の解決を図りました。
- VATを活用し1つのメッシュで複数の破片を表現する。
- 物理演算を事前に計算し、その点群データをNiagaraで読み込む。

#### VATでの破片表現

Niagaraでパーティクルとして破片を表示させるため、VATを用いて同一のメッシュで各破片を表現する手法を取りました。
フレームごとに1つずつ破片を表示するアニメーションをつけたVATシェーダー付きメッシュを作成し、Niagaraでシェーダーのフレーム番号のパラメータを変更することで各破片を表現しました。

![フレームごとに表示させた破片](/portfolio/images/pieces-anim.webp)

![](/portfolio/images/pieces-niagara.drawio.webp)

<figure>
    <img src="/portfolio/images/niagara-static-off.jpg" class="left" height="300px">
    <img src="/portfolio/images/niagara-static-on.jpg" class="left" height="300px">
    <figcaption>
        NiagaraでVAT用メッシュで天使像を復元した様子<br>（ワイヤフレーム表示のON/OFF）
    </figcaption>
</figure>
<br>
ワイヤフレーム表示にすると三角ポリゴンが集まったVAT用メッシュであることが分かります。

#### 物理演算

##### Houdiniでの演算

以下に大まかな作成工程を示します。

1. 破片の作成
<!-- ![](/portfolio/images/angel-fracture.png) -->
<img src="/portfolio/images/angel-fracture.png" height="300px">
<br style="clear:left;">
3Dスキャン素材の天使像をRemesh等で最適化したのち、<br>RBD Material Fracture SOPで破片を作成します。

2. 物理演算
<video muted autoplay loop height="300px">
    <source src="/portfolio/images/rbdsim.mp4" type="video/webm">
</video>
</figure>
<br style="clear:left;">
速度ベクトルを付加したり台座下部の破片を動かないように設定したりしたのち、物理演算を行います。<br>
内側からの力で破片が全方位に均等に飛び散り、降ってくる様子が視界に収まるように速度の調整を行いました。

3. Export用の点群に変換
<video muted autoplay loop height="300px">
    <source src="/portfolio/images/houdini-niagara.mp4" type="video/webm">
</video>
<br style="clear:left;">
Niagaraでパーティクルとして読み込むため、
元の破片のID（=フレーム番号）や回転情報等を保持した点群に変換します。

##### Niagaraでの再生

<video muted autoplay loop height="300px">
    <source src="/portfolio/images/niagara-particle.mp4" type="video/webm">
</video>
<br style="clear:left;">
HoudiniでExportした点群をパーティクルとしてNiagaraで読み込みます。
<br><br>
<video muted autoplay loop height="300px">
    <source src="/portfolio/images/niagara-rbd.mp4" type="video/webm">
</video>
<br style="clear:left;">
点群に元の破片のID（=フレーム番号）や回転の情報等をアトリビュートとして付加しているため、<br>この情報を元にNiagaraで物理演算を復元します。

#### 物理演算とパーティクルシステムの組み合わせ

読み込んだ物理演算をすべて再生するのではなく、途中でNigaraで作る中央を旋回するアニメーションに切り替え、最終的に点群情報に付加された初期位置に戻します。

![](/portfolio/images/niagara-trans.drawio.webp)

下から上へ状態が遷移していく表現を行うため、Houdiniで初期位置を0~1に正規化したアトリビュートを作成し、Export用の点群に付加しました。
このアトリビュートを使ってNiagaraで状態の遷移をオフセットしています。

<div class="flexbox">
<video class="nomargin" muted autoplay loop>
    <source src="/portfolio/images/relbY.mp4" type="video/webm">
</video>
<img class="nomargin" src="/portfolio/images/angel-relbY.drawio.png">
</div>

### 魔法エフェクト

空中で魔法が揺らいでいる様子を表現するため、シェーダーで文字パーティクルのUVやLineの太さにノイズを加えています。

<video muted autoplay loop>
    <source src="/portfolio/images/magic.mp4" type="video/webm">
</video>
<br>

ルーン文字のエフェクトはルーン文字のフォントが一覧になっているFlipbookテクスチャからランダムに文字を表示させています。
このテクスチャはシェルスクリプトを記述して自動で生成できるようにしました。
このスクリプトの生成する文字列やフォントの指定を変えるだけで何種類ものFlipbookテクスチャのパターンが作成できるため、素早いプロトタイプの作成が行えました。

<figure>
<img src="/portfolio/images/runes.webp" width="200px" />
<figcapture>
生成されたルーン文字のFlipbookテクスチャ
</figcapture>
</figure>
<br style="clear:left;">

```bash generate-fonts
#!/bin/bash

# 生成する文字列
readonly CHARS=$(echo {a..z})

# 生成するフォント
readonly FONT="MOONRUNE.TTF"

# 各文字の画像を生成
echo $CHARS | tr ' ' '\n'  | xargs -I{} convert -background none -fill white -size 64x64 -gravity center -font /usr/share/fonts/$FONT label:{} {}.png

# 各文字のファイル名を配列に格納
for char in $CHARS
do
    files+=($char.png)
done

# 一枚にまとめる
montage -quality 100 -geometry +0+0 -label "" -background none  ${files[@]} runes.png

rm ${files[@]}
```

### 爆発エフェクト

**爆発エフェクトの画像**
このエフェクトは衝撃波と煙の二種類で構成されています。

<div class="flexbox">
    <video class="nomargin" muted autoplay loop>
        <source src="/portfolio/images/niagara-shockwave.mp4" type="video/webm">
    </video>
    <video class="nomargin" muted autoplay loop>
        <source src="/portfolio/images/niagara-smoke.mp4" type="video/webm">
    </video>
</div>
<br>

衝撃波はシェーダーで屈折率にノイズをかけた球メッシュをスケールさせることで空間を歪めています。
煙はHoudiniでシミュレーションしたものをFlipbookテクスチャ化して使用しています。

<figure>
<video muted autoplay loop>
    <source src="/portfolio/images/smoke-preview.mp4" type="video/webm">
</video>
<figcaption>
    Houdiniのスモークシミュレーション
</figcaption>
</figure>

### 背景

背景の制作にはHoudini Engine for Unrealを活用しました。
2ソフト間で背景モデルデータを同期し、Houdiniでモデルを作成しつつUE5にてリアルタイムでその結果を確認するという方法でモデリング、インスタンスの配置、マテリアルの適用、ライティングを並行して進めました。
柱のモデルや各マテリアルはMegascansのアセットを使用しました。

![Houdini側の作業画面](/portfolio/images/houdiniengine-houdini.jpg)
![UE側の作業画面](/portfolio/images/houdiniengine-ue.jpg)

### ポストプロセス

ゲームでの演出の想定のため、映像編集ソフトでの後処理は行わずCine Camera ActorのPost Processでシネマティックな空気感になるよう調整を行いました。


| 設定項目     |          |
| ------------ | -------- |
| 露出         | やや暗め |
| 被写界深度   | 浅め     |
| 色温度       | 低め     |
| 彩度         | 低め     |
| コントラスト | 低め     |
<br>
{% twtw /portfolio/images/pp-off.webp /portfolio/images/pp-on.webp %}

---
## Building Generator +α

**作品のyoutube**

### 概要

<table>
    <tr>
        <td>使用ソフト</td>
        <td>Unreal Engine 5<br>Houdini</td>
    </tr>
    <tr>
        <td>制作期間</td>
        <td>3週間</td>
    </tr>
</table>
<br>

UE5で素早く建物を作成するツールを制作しました。
以前にHoudini内でメッシュを生成するものは作ったことがありましたが、UE上で動作しメッシュはUEのアセットをインスタンス化できたほうが実用性があると考え、今回一から作り直しました。
建物だけでなく、道路やポールを作成する機能も追加しました。
実際にゲーム開発で使用することを想定し、汎用性の高い作りを目指しました。
本ツールはUE5のNaniteメッシュのアセットにも対応しているため、寄りで見ても品質の高い建物のアセットを作成することができます。

<figure>
<video muted autoplay loop>
    <source src="/portfolio/images/apart1.mp4", type="video/mp4">
</video>
<figcaption>
    Building Generator(旧作)
</figcaption>
</figure>

### 機能

#### Building Generator

指定した壁や柱、屋根のアセットを使い、ガイドボックスの形状に合わせてアパートを生成します。
壁や柱のパーツは似た形状であれば別のアセットに差し替えることも可能なので、バリエーションを簡単に作成することができます。

**パーツを指定する画面**

**壁を差し替えたバージョン**

また、任意の建物パーツの付近にプロップを配置できる機能も作成しました。

**プランター**
**看板**
**軒先テント**
**旗**

**設定画面の画像**
**ガイドを調整している図**
**シード値を変えている図**

#### Road Generator

ガイドボックスを配置して道路が作成できます。
ガイドボックスのスケールを変更したり、増やしたりすることもできます。
歩道と車道のマテリアルや縁石のアセットはUEから差し替えができるようになっています。

![寄りで見た道路](/portfolio/images/index_2022-09-25-17-32-02.jpg)


#### Curve Tool
Unreal Spline Componentsをガイドとし、カーブに沿ってアセットを配置することができます。

**図**

### 処理の高速化とNanite対応の工夫

開発者がストレス無く本ツールを使用できるよう、処理の高速化にも注力しました。
この処理速度でボトルネックとなったのがUE ↔ Houdini Engine間のメッシュデータの転送時間でした。
また、ソフト間でメッシュデータを転送するうちにNaniteの情報も消えてしまい単なるハイポリゴンとなりメモリの使用量が増大するため、この問題にも対処しました。

![](/portfolio/images/instance-nanite.drawio.webp)

解決策として、入力にはローポリゴンのアセットを指定し、Houdini内でNaniteメッシュアセットのインスタンス情報を持った点群に変換することで大幅な処理速度の改善とNaniteメッシュへの対応が行えました。

![Naniteメッシュアセットへのインスタンスの点群に変換する処理](/portfolio/images/replace-instance.webp)


```c set_instance_attrノードのVEX
// 入力に指定されたメッシュ名を書き換え、Naniteメッシュのアセットをソースとするインスタンス用アトリビュートを作成
string srcPath = prim(0, "unreal_input_mesh_name", @primnum);
s@unreal_instance = re_replace(r"_lod\d_", "_high_", srcPath);

// packed primのtransform行列を分解し、インスタンス用のスケールと回転のアトリビュートを作成
matrix xform = getpackedtransform(0, @primnum);
vector pivot = {0,0,0};
v@scale = cracktransform(0, 0, 2, pivot, xform);
p@orient = eulertoquaternion(radians(cracktransform(0, 0, 1, pivot, xform)), 0);
```

---
## KUMALEON Promotion Video

**ツイート**
前半2カット（15秒）を担当

### 概要

<table>
    <tr>
        <td>使用ソフト</td>
        <td>Houdini<br>DaVinci Resolve</td>
    </tr>
    <tr>
        <td>レンダラ</td>
        <td>Karma(Houdini内製レンダラ)</td>
    </tr>
    <tr>
        <td>納期</td>
        <td>1ヶ月</td>
    </tr>
</table>
<br>
ジェネレーティブアートを身にまとったクマのキャラクターのNFTプロダクト "KUMALEON" 発表時のプロモーション案件として作成した映像です。
KUMALEON自身はアニメーションを付けないという制約があったため、カメラや周りのオブジェクトの動きで情報量を調節するよう心がけました。
まず最初に最低限見せられる映像を作り、余った期間でディティールを足していってブラッシュアップする制作方法を採りました。
タイトなスケジュールの中で レンダリング ↔ 調整 の試行回数を増やすため、Karmaレンダラで大量のオブジェクトをインスタンスとして高速にレンダリングできるよう工夫しました。
チームメンバーの努力の甲斐あってリリース時にはNFTプロダクトのグローバルトレンド1位を獲得できました。

### スケジュール

### 前半カット
#### オブジェクト
ジェネレーティブアーティストのOkazz氏の原案のアートが立体化したイメージのオブジェクトを作成し、それぞれ出現時のアニメーションを付けました。
**オブジェクトs**
**原案アート**

3D空間上にアートが展開されていくイメージで、中心から徐々にオブジェクトが出現していくよう配置しました。
**オブジェクトのアニメーション**
また、動いていくカメラからオブジェクトのディティールが見えるように、カメラの軌道上にオブジェクトを手動で配置しています。
**手動配置のオブジェクト**
最終的に投稿先がtwitterで複数のデバイスから閲覧されるため、遠くのオブジェクトが潰れて見えないように間引いたり、スカスカに見えないように増やしたりしながら画面の情報量を調整しました。
**調整過程で増やしたPlexus**

#### カメラ
疾走感を出しながらも緩急のメリハリがあり、かつオブジェクトのディティールは見えるようにイージングの調整を行いました。
また、次のカットのカメラの動きが下方向へのピッチから始まるため、自然に繋げられるよう軌道や回転を工夫しました。

**カメラ軌道**
**トランジション**
**トランジション直前のカメラの縦回転時にオブジェクトが高速で流れていって見えない問題があったため、カメラに付随して嘘の軌道をするオブジェクトを作成しています**
//**当初の案**


### 後半カット
#### オブジェクト
後半カットでは大きく分けて「廊下」と「ソースコードの壁」の2つを作成しました。
**廊下**
**ソースコードの壁**

##### ソースコードの壁
本オブジェクトは以下の工程で制作しました

**コードが書いてあるCSVデータを用意する**
**CSVデータを行ごとにFont SOPでメッシュ化する**
**行ごとの大きさの板ポリゴンを作成する**
**UV Lauout SOPで壁の大きさに板ポリゴンを敷き詰める**
**板ポリゴンを元のコードに置換する**
**カメラからコードへの視線ベクトルを計算し、被って見える文字を削除する**

文字ごと、行ごとにアニメーションさせるため、それぞれに文字や行のIDアトリビュートを設定し、個別に制御できるようにしています。

**文字IDの可視化**
**行IDの可視化**

#### アニメーション

廊下の奥から透明になっていくとともにソースコードが出現する表現を行うため、廊下にアニメーション制御用のアトリビュートを作成しました。

**マスクの可視化**

**ソースコードのアニメーション**

このアトリビュートからオブジェクトのアルファを制御し、廊下の消滅を表現しました。

**廊下の消滅**

#### マテリアル・ライティング
ライトはxxxを置いています。

**ライトの配置の画像**

廊下の床と壁が消えてドアだけが残ったときにlightlinker云々

部屋の光が照り返し、廊下の床の質感がわかるように床のspecularを調整しました。

**照り返し画像**

### コンポジット

### 素材の分解

後工程の人に渡すため、映像を各素材に分解しました。

**画像**

---
## Pyro & RBD
=======

### 概要

<table>
    <tr>
        <td>使用ソフト</td>
        <td>Houdini<br>DaVinci Resolve</td>
    </tr>
    <tr>
        <td>レンダラ</td>
        <td>Karma(Houdini内製レンダラ)</td>
    </tr>
    <tr>
        <td>製作期間</td>
        <td>2ヶ月</td>
    </tr>
</table>
<br>
都市の爆破解体をイメージして作りました。
実際の建物の爆破解体の資料を見ながら煙の動きに説得力が出るようにPyroシミュレーションの試行錯誤を重ねました。
都市の規模が大きくなっても建物ごとに個別にシミュレーションを調整せずに済むよう、シミュレーション周りの処理を一元化しました。

### 破壊する建物の作成とRigid Body Dynamics

1. Mapboxから都市データを取得
Mapbox(地図情報サービス)から破壊する都市の3Dデータを取得します。

2. メッシュの最適化
メッシュを物理演算で使用できるように

3. 床の作成
4. 破片の作成
5. コンストレインの設定
6. シミュレーション

### Pyroシミュレーション


建物が崩壊する際の煙は建物全体から吹き出すものと下部から吹き出すものの2種類で構成されています。
**画像AB**
これらは以下の工程で作成しました。
**DustなんちゃらSOPでクラック上にパーティクルシミュレーションの発生源となるポイントを作成**
**POPNetで煙のベースとなるパーティクルをシミュレーション 建物の法線方向に吹き出すよう速度ベクトルを付加しています**
**ボリューム化**
**流体シミュレーション**