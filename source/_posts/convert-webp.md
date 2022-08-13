---
title: 連番画像からWebpへの変換とリサイズを行うシェルスクリプトを作った
date: 2022-08-13T13:31:59+09:00
tags:
- シェルスクリプト
- Linux
categories: blog
# cover_index: /assets/convert-webp/450.webp
hidden: true
---

## 目次
<!-- toc -->

## はじめに
このブログに掲載する画像はwebp形式を使っているが、homeのサムネと作品詳細ページの画像とで2種類のサイズのwebp画像を用意する必要がある。  
わざわざ2種類のサイズの連番画像をDavinci Resolveから書き出して、webp変換ツール（これまでは[アニメ画像に変換する君](https://apps.microsoft.com/store/detail/%E3%82%A2%E3%83%8B%E3%83%A1%E7%94%BB%E5%83%8F%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B%E5%90%9B/9N36KVC52ST9?hl=ja-jp&gl=JP)を使っていた）を立ち上げてポチポチして...  
っていうのが面倒だったので、連番画像からWebpへの変換と同時にリサイズもしてくれるシェルスクリプトを書いてみた。

シェルスクリプトだからWindowsだとWSLを使う必要があるけどね。

## 動作確認環境

WSL Ubuntu(20.02.LTS)とUbuntu 18.04.LTSで動作確認済

## 前提条件

webpとimagemagickをインストールする必要がある

```bash
$ sudo apt install webp imagemagick
```

## ソースコード
convert-webp
```bash
#!/bin/bash

ceil(){
    echo $(( `echo $1|cut -f1 -d"."` + 1 ))
}

usage(){
  echo "e.g.: convert-webp -s450x450 -f30 \"*.tif\" 01.webp"
}
 
CMDNAME=`basename $0`
TMP=/tmp/$CMDNAME
if [ -e $TMP ]; then
  rm -r $TMP
fi

# オプション引数の処理
while getopts s:f: OPT
do
  case $OPT in
    "s" ) FLG_S="TRUE" ; VALUE_S="$OPTARG" ;;
    "f" ) FLG_F="TRUE" ; VALUE_F="$OPTARG" ;;
  esac
done
shift `expr $OPTIND - 1`

# 引数が0ならusageを表示
if [ $# -eq 0 ]; then
  usage
  exit 1
fi

if [ $# -ne 2 ]; then
  echo "Invalid argument count."
  exit 1
fi

# リサイズ処理(オプション)
TARGET=$1
if [ "$FLG_S" = "TRUE" ]; then
    mkdir $TMP
    cp $TARGET $TMP
    TARGET=$TMP/$TARGET
    mogrify -resize $VALUE_S $TARGET
fi

# フレームレートの設定
FRAMERATE=24
if [ "$FLG_F" = "TRUE" ]; then
    FRAMERATE=$VALUE_F
fi
DURATION=$(ceil 1000/$FRAMERATE)

# 変換
img2webp -lossy -o $2 -d $DURATION $TARGET
```

## 使い方
基本的な使い方は以下。inputファイルの拡張子はPNG, JPEG, TIFFが使用可能。
`$ convert-webp input.png output.webp`

入力ファイルのワイルドカードは""で囲むこと
`$ convert-webp "*.tiff" out.webp`

オプション引数-sをつけるとサイズが指定できる。指定がないと入力のサイズそのまま。
`$ convert-webp -s450x450 "*.tiff" out.webp`

オプション引数-fをつけるとフレームレートが指定できる。指定がないと24fps。
`$ convert-webp -f30 "*.tiff" out.webp`

引数がないと使用例を表示する。
```
$ convert-webp
e.g.: convert-webp -s450x450 -f30 "*.tif" 01.webp
```

このシェルスクリプトを~/bin/convert-webpとして保存しシェルを再起動すると、  
どのディレクトリからでもconvert-webpコマンドが使用できる。

## おわりに

このシェルスクリプトで使っているimg2webpコマンドには圧縮率やループ回数のオプションもあるので、  
興味のある人は[参考](#参考)の公式ドキュメントを参照のこと。

## 参考

> img2webp
> https://developers.google.com/speed/webp/docs/img2webp

<br>