---
title: Portfolio
date: 2022-09-23 20:32:23
---

## Explosion
<!-- {% youtube mruCBrgPKAM %} -->
<iframe class="video" src="https://www.youtube.com/embed/i1r740jeZoE?controls=1&color=white" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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
エフェクトを含めて映像作品となるように背景・ライティング等の画作りまで気を配りました。
複数のエフェクトが連続するため、エフェクト間の整合性が取れるよう工夫しました。
VAT（頂点アニメーションテクスチャ）のシェーダを用いてUEだけではできなかった物理演算と
パーティクルシステムの組み合わせの表現を実現しました。

### 制作過程
本作は以下の順序で制作しました。

1. [天使像の破片エフェクト](#天使像の破片エフェクト)
2. [爆発エフェクト](#爆発エフェクト)
3. [魔法エフェクト](#魔法エフェクト)
4. [背景](#背景)
5. [予備動作](#予備動作)
6. [ポストプロセス](#ポストプロセス)


### 天使像の破片エフェクト

本作品を制作するにあたり最大の課題はNiagaraを用いて天使像の破片の物理演算の表現とパーティクルシステムの表現を組み合わせることでした。
そのため、まずこのエフェクトの制作から着手しました。

#### Niagaraの問題点とHoudiniの活用による解決

Niagaraは仕様上、一つのエミッタシステムに破片のような複数の形状のメッシュを割り当てることはできず、破片が飛び散るような複雑な物理演算も不向きです。
そこで、Houdiniを活用し以下の方法で解決しました。
- VATを活用し1つのメッシュで複数の破片を表現する。
- 物理演算を事前に計算し、その点群データをNiagaraで読み込み復元する。

#### VATでの破片表現

Niagaraでパーティクルとして破片を表示させるため、VATを用いて同一のメッシュで各破片を表現する手法を取りました。
フレームごとに1つずつ破片を表示するアニメーションをつけたVATシェーダー付きメッシュを作成し、Niagaraでシェーダーのフレーム番号のパラメータを変更することで各破片を表現しました。

<figure>
    <video muted autoplay loop height="300px">
        <source src="/portfolio/images/pieces-anim.mp4" type="video/webm">
        <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
    </video>
    <figcaption>
        フレームごとに表示させた破片
    </figcaption>
</figure>
<br>

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

1. メッシュの粉砕
<!-- ![](/portfolio/images/angel-fracture.png) -->
<img src="/portfolio/images/angel-fracture.png" height="300px">
<br style="clear:left;">
3Dスキャン素材の天使像をRemesh等で最適化したのち、<br>RBD Material Fracture SOPでメッシュを粉砕します。

2. 物理演算
<video muted autoplay loop height="300px">
    <source src="/portfolio/images/rbdsim.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
</figure>
<br style="clear:left;">
速度ベクトルを付加したり台座下部の破片を動かないように設定したりしたのち、物理演算を行います。<br>
内側からの力で破片が全方位に均等に飛び散り、降ってくる様子がプレイヤーの視界に収まるように速度の調整を行いました。

3. Export用の点群に変換
<video muted autoplay loop height="300px">
    <source src="/portfolio/images/houdini-niagara.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
<br style="clear:left;">
Niagaraでパーティクルとして読み込むため、
元の破片のID（=フレーム番号）や回転情報等を保持した点群に変換します。

##### Niagaraでの再生

<video muted autoplay loop height="300px">
    <source src="/portfolio/images/niagara-particle.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
<br style="clear:left;">
HoudiniでExportした点群をパーティクルとしてNiagaraで読み込みます。
<br><br>
<video muted autoplay loop height="300px">
    <source src="/portfolio/images/niagara-rbd.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
<br style="clear:left;">

先に作成したVATメッシュと組み合わせ、物理演算を復元します。
点群に元の破片のID（=フレーム番号）や回転の情報等をアトリビュートとして付加しているため、<br>どのパーティクルにどの破片が割り当てるか等を表現できます。

#### 物理演算とパーティクルシステムの組み合わせ

読み込んだ物理演算をすべて再生するのではなく、途中でNigaraで作った中央を旋回するアニメーションに切り替え、最終的に点群情報に付加された初期位置に戻します。

![](/portfolio/images/niagara-trans.drawio.webp)

下から上へ状態が遷移していく表現を行うため、Houdiniで初期位置のY座標を0~1に正規化したアトリビュートを作成し、Export用の点群に付加しました。
このアトリビュートを使ってNiagaraで状態の遷移をオフセットしています。

<div class="flexbox">
<video class="nomargin" muted autoplay loop>
    <source src="/portfolio/images/relbY.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
<img class="nomargin" src="/portfolio/images/angel-relbY.drawio.png">
</div>

### 爆発エフェクト

天使像の破片が飛び散る瞬間に出現するエフェクトです。
このエフェクトは衝撃波と煙の二種類で構成されています。

<div class="flexbox">
    <video class="nomargin" muted autoplay loop>
        <source src="/portfolio/images/niagara-shockwave.mp4" type="video/webm">
        <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
    </video>
    <video class="nomargin" muted autoplay loop>
        <source src="/portfolio/images/niagara-smoke.mp4" type="video/webm">
        <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
    </video>
</div>
<br>

衝撃波はシェーダーで屈折率にノイズをかけた球メッシュをスケールさせることで空間を歪めています。
煙はHoudiniでシミュレーションしたものをFlipbookテクスチャ化して使用しています。

<figure>
<video muted autoplay loop>
    <source src="/portfolio/images/smoke-preview.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
<figcaption>
    Houdiniのスモークシミュレーション
</figcaption>
</figure>


### 魔法エフェクト

ルーン文字を生成しながら二重らせん状に動いていくエフェクトです。
空中で魔法が揺らいでいる様子を表現するため、シェーダーで文字パーティクルのUVやLineの太さにノイズを加えています。

<div class="flexbox">
    <figure>
        <video muted autoplay loop>
            <source src="/portfolio/images/magic-turn.mp4" type="video/webm">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
        <figcaption>
            魔法エフェクト全体像
        </figcaption>
    </figure>
    <figure>
        <video muted autoplay loop>
            <source src="/portfolio/images/magic.mp4" type="video/webm">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
        <figcaption>
            魔法エフェクトが揺らいでいる様子
        </figcaption>
    </figure>
</div>
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

```bash Flipbookテクスチャを生成するシェルスクリプト
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

### 背景

背景の制作にはHoudini Engine for Unrealを活用しました。
2ソフト間で背景モデルデータを同期し、Houdiniでモデルを作成しつつUE5にてリアルタイムでその結果を確認するという方法でモデリング、インスタンスの配置、マテリアルの適用、ライティングを並行して進めました。
柱のモデルや各マテリアルはMegascansのアセットを使用しました。

![Houdini側の作業画面](/portfolio/images/houdiniengine-houdini.webp)
![UE側の作業画面](/portfolio/images/houdiniengine-ue.webp)

### 予備動作

魔法エフェクトの出現、爆発の発生に緩急や整合性が無いと感じたため、予備動作となる演出を追加しました。
魔法エフェクトの出現前にはチリチリと飛び散る火花を追加しました。

<video muted autoplay loop>
    <source src="/portfolio/images/magic-initial.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>
<br>

爆発の前には「溜め」の表現として像の赤熱、迸る火花、ルーン文字の凝縮、カメラ揺れを追加しました。

<video muted autoplay loop>
    <source src="/portfolio/images/magic-charge.mp4" type="video/webm">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>

### ポストプロセス

ゲームでの演出の想定のため、映像編集ソフトでの後処理は行わずCine Camera ActorのPost Processでシネマティックな空気感になるよう調整を行いました。


| 設定項目     |      |
| ------------ | ---- |
| 色温度       | 低め |
| 彩度         | 低め |
| コントラスト | 低め |
| ビネット     | 弱め |
<br>
{% twtw /portfolio/images/pp_off.webp /portfolio/images/pp_on.webp %}

<br>
<br>

---
## Building Generator +α

<iframe class="video" src="https://www.youtube.com/embed/ClQu16G9cz8?controls=1&color=white" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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
実際にゲーム開発で使用することを想定し、汎用性の高い作りを目指しました。
本ツールはNaniteメッシュのアセットにも対応しているためメモリ効率が良く、寄りで見ても品質の高い建物のアセットを作成することができます。

<figure>
    <video muted autoplay loop>
        <source src="/portfolio/images/apart1.mp4", type="video/mp4">
        <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
    </video>
    <figcaption>
        Building Generator(旧作)
    </figcaption>
</figure>

### 機能

#### Building Generator

指定した壁や柱、屋根のアセットを使い、ガイドボックスの形状に合わせてアパートを生成します。
壁や柱のパーツは似た形状であれば別のアセットに差し替えることも可能なので、バリエーションを簡単に作成することができます。

![壁のパーツを差し替えた建物](/portfolio/images/apart-replaced.jpg)

屋根以外のパーツはLabs Building Generatorを使用してガイドボックスに従った建物を作成しています。

![壁面の生成処理](/portfolio/images/building-generator.drawio.webp)

屋根はLabs Building Generatorで生成できないため、Chain SOPを使ってパーツを屋根のカーブ上に並べています。

![屋根の生成処理](/portfolio/images/roof-generator.drawio.webp)

また、任意の建物パーツの付近にプロップを配置できる機能も作成しました。
カフェメニューやプランターのように、ある範囲内にランダムに配置したい場合はガイドグリッド（赤い縞模様）を可視化して直感的に配置を行うことができます。

<div class="flexbox">
    <span>
        <figure>
            <img src="/portfolio/images/apart-cafemenu.jpg">
            <figcaption>
                カフェメニュー
            </figcaption>
        </figure>
    </span>
    <span>
        <figure>
            <img src="/portfolio/images/apart-tent.jpg">
            <figcaption>
                軒先テント
            </figcaption>
        </figure>
    </span>
    <span>
        <figure>
            <img src="/portfolio/images/apart-flag.jpg">
            <figcaption>
                旗
            </figcaption>
        </figure>
    </span>
    <span>
        <figure>
            <img src="/portfolio/images/apart-planter.jpg">
            <figcaption>
                プランター
            </figcaption>
        </figure>
    </span>
</div>

![プロップを配置する設定画面](/portfolio/images/apart-prop-setting.drawio.webp)

<figure>
    <video muted autoplay loop>
        <source src="/portfolio/images/apart-generate-prop.mp4", type="video/mp4">
        <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
    </video>
    <figcaption>
        プロップを設定している様子
    </figcaption>
</figure>

![プロップを配置する処理](/portfolio/images/node-create-prop.drawio.webp)

#### Road Generator

ガイドボックスを配置して道路が作成できます。
ガイドボックスのスケールを変更したり、増やしたりすることもできます。
歩道と車道のマテリアルや縁石のアセットはUEから差し替えができるようになっています。

![ガイドボックスのON/OFF](/portfolio/images/road-onoff.webp)

![寄りで見た道路](/portfolio/images/road.jpg)


#### Curve Tool
Unreal Spline Componentsをガイドとし、カーブに沿ってアセットを配置することができます。

![ポールを配置している様子](/portfolio/images/curve.jpg)

### 処理の高速化とNanite対応の工夫

開発者がストレス無く本ツールを使用できるよう、処理の高速化にも注力しました。
特に処理時間がかかり問題となっていたのがUE ↔ Houdini Engine間のメッシュデータの転送時間でした。
また、ソフト間でメッシュデータを転送するうちにNaniteの情報も消えてしまい単なるハイポリゴンとなりメモリの使用量が増大するため、この問題にも対処しました。

![](/portfolio/images/instance-nanite.drawio.webp)

解決策として、まずメッシュの代わりにアセットごとにメッシュのバウンディングボックスの情報を持った頂点をHoudini Engineへ転送します。
次にHoudini Engine側でその頂点の情報からバウンディングボックスを作成し、建物の形状に並べます。
最後に並べたバウンディングボックスをそれぞれ元のアセットへのインスタンスの点群へ変換し、UEへ転送します。


![頂点をバウンディングボックスに変換する処理](/portfolio/images/create-instance-box.jpg)


```c add_bbox_pointsノードのVEX
// バウンディングボックスの情報を取得
vector max = point(1, "unreal_bbox_max", 0);
vector min = point(1, "unreal_bbox_min", 0);
addpoint(0, max);
addpoint(0, min);
```

![バウンディングボックスからインスタンスの頂点に変換する処理](/portfolio/images/restore-instance-points.jpg)

```c set_instance_attrノードのVEX
// packed primのpackedfulltransform行列を分解し、インスタンス用のスケールと回転のアトリビュートを作成
matrix xform = getpackedtransform(0, @primnum);
vector pivot = {0,0,0};
v@scale = cracktransform(0, 0, 2, pivot, xform);
p@orient = eulertoquaternion(radians(cracktransform(0, 0, 1, pivot, xform)), 0);
```

<br>
<br>

---
<!-- ## KUMALEON Promotion Video

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

--- -->
## Scrap & Build

<video muted autoplay loop>
    <source src="/portfolio/images/pyro.mp4", type="video/mp4">
    <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
</video>

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

### 破壊する建物の作成と剛体シミュレーション

1. Mapboxから都市データを取得
Mapbox(地図情報サービス)から破壊する都市の3Dデータを取得し、必要な建物だけ残します。

![](/portfolio/images/buildings-raw.jpg)

2. メッシュのセットアップ
トポロジーの最適化・建物内の床の作成・メッシュの粉砕を行います。

<figure>
<div class="flexbox">
    <img src="/portfolio/images/building-wall.jpg">
    <img src="/portfolio/images/building-floor.jpg">
</div>
    <figcaption>
        粉砕した建物（左：外壁　右：床）
    </figcaption>
</figure>
<br>

5. 物理演算とコンストレインの調整
下から徐々にクラックが伝搬して崩壊していくようにしたかったため、コンストレインの強度を建物の下部は低く、上部は高くなるよう調整しました。
<figure>
    <img src="/portfolio/images/building-constrain.jpg">
    <caption>
        コンストレイン強度の可視化
    </caption>
</figure>

<figure>
    <div class="flexbox">
        <video muted autoplay loop>
            <source src="/portfolio/images/building-before.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
        <video muted autoplay loop>
            <source src="/portfolio/images/building-after.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
    </div>
        <figcaption>
            調整前（左）と調整後（右）<br>建物右の点群はクラックの発生を可視化した様子<br>建物上部のクラックの入り方が異なっている。
        </figcaption>
</figure>

### 煙のシミュレーション
#### 崩壊シーン
建物が崩壊する際の煙は建物下部から吹き出すものと全体から吹き出すものの2種類で構成されています。
これらは以下の工程で作成しました。
1. パーティクルシミュレーションの発生源を作成
建物の物理演算結果を元に、クラック上にパーティクルシミュレーションの発生源となるポイントを作成します。
<figure>
    <video muted autoplay loop>
        <source src="/portfolio/images/buildings-debris.mp4", type="video/mp4">
        <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
    </video>
    <figcaption>
        クラックからポイントが発生している様子
    </figcaption>
</figure>

2. パーティクルシミュレーション
スモークシミュレーションの元となるパーティクルをシミュレーションして作成します。
工程1で作成した発生源から建物の外側に吹き出すように速度を与えています。
<figure>
    <div class="flexbox">
        <video muted autoplay loop>
            <source src="/portfolio/images/particles-lower.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
        <video muted autoplay loop>
            <source src="/portfolio/images/particles-upper.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
    </div>
    <figcaption>
        パーティクルシミュレーション（左：下部　右：全体）
    </figcaption>
</figure>

3. スモークシミュレーション
工程2のパーティクルを元に煙のシミュレーションを行います。
のっぺりしたキノコ雲が発生しないように、かつノイズが多すぎてボソボソにならないようにTurbulenceやDisturbanceの調整を繰り返しました。
建物下部のスモークシミュレーションではDisturbanceの値にキーを打ち、最初の方だけノイズが強くかかるようにしています。
<figure>
    <div class="flexbox">
        <video muted autoplay loop>
            <source src="/portfolio/images/pyro-lower.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
        <video muted autoplay loop>
            <source src="/portfolio/images/pyro-upper.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
    </div>
    <figcaption>
        スモークシミュレーション（左：下部　右：全体）
    </figcaption>
</figure>

#### 生成シーン
建物が生成されるシーンの煙は建物の床を発生源とし、建物の法線方向にノイズを加えたボリュームを速度フィールドとしてシミュレーションしています。


<div class="flexbox">
    <span>
        <figure>
            <img src="/portfolio/images/grow-points.jpg">
            <figcaption>
                スモーク発生源のポイント
            </figcaption>
        </figure>
    </span>
    <span>
        <figure>
            <video muted autoplay loop>
                <source src="/portfolio/images/grow-buildings.mp4", type="video/mp4">
                <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
            </video>
            <figcaption>
                シミュレーションに与える速度フィールドの元となる建物
            </figcaption>
        </figure>
    </span>
</div>
<br>

シミュレーションしたままでは発生源のボリュームの矩形が目立ったので、Volume Wrangleでしきい値以下の速度のボリュームを削除して見た目を調整しています。
調整後も出現時に若干矩形が見えていますが、建物を重ねると見えないので問題はありませんでした。

<br>
<figure>
    <div class="flexbox">
        <video muted autoplay loop>
            <source src="/portfolio/images/grow-before.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
        <video muted autoplay loop>
            <source src="/portfolio/images/grow-after.mp4", type="video/mp4">
            <p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p>
        </video>
    </div>
    <figcapture>
        スモークシミュレーション（左：調整前　右：調整後）
    </figcapture>
</figure>

### ライティング・コンポジット

レンダラーはKarmaのため、LOP階層でマテリアルの作成やライティングを行っています。
建物とスモークで別々に明るさを調節できるようにドームライトを分け、Light Linkerでそれぞれ影響するライトを別に設定しています。

![LOP階層](/portfolio/images/node-pyro-stage.drawio.png)

レンダリングのやり直しは時間が掛るため、Houdini側では最低限の質感設定とライティングのみ行い、色味はDaVinci Resolve側で調整しています。

![DaVinci ResolveのColorページ](/portfolio/images/resolve-node.drawio.webp)

{% twtw /portfolio/images/pyro-comp-before.webp /portfolio/images/pyro-comp-after.webp 1080 1080 %}
