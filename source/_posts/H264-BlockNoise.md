---
title: 【DaVinci Resolve】H.264エンコードでブロックノイズが出たときの対処法
date: 2022-07-29T14:30:32+09:00
tags: DaVinci Resolve
categories: blog
# cover_index: /assets/H264-BlockNoise/450.webp
hidden: true
---

## はじめに
![2022-07-29T143752](2022-07-29T143752.png)
![2022-07-29T143922](2022-07-29T143922.png)

動画をH.264形式でエンコードした際にこんなブロックノイズが発生した。


## 環境

| 作業環境        |                     |
| :-------------- | ------------------- |
| OS              | Windows 10 Home x64 |
| DaVinci Resolve | 18.0.1              |

| 書き出し設定     |                 |
| ---------------- | --------------- |
| Format           | MP4             |
| Codec            | H.264           |
| Resolution       | 1080x1920       |
| Frame rate       | 30              |
| Quality          | Automatic(Best) |
| Encoding Profile | Main            |
| Key Frames       | Automatic       |

## 結論

H.265でエンコードした後、ffmpegでH.264形式に変換するとうまくいった。

10bit H.265 → 10bit H.264の場合
`ffmpeg -i input.mp4 -c:v libx264 -crf 18 -c:a copy output.mp4`
10bit H.265 → 8bit H.264の場合
`ffmpeg -i input.mp4 -c:v libx264 -crf 18 -vf format=yuv420p -c:a copy output.mp4`

## 経緯

調べてみるとどうもH.264の圧縮がうまくいってないときに発生するらしい。

>参考1
>Premiere ProのH.264の書出しでブロックノイズが出る場合があります。
>https://community.adobe.com/t5/premiere-pro%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0-discussions/premiere-pro%E3%81%AEh-264%E3%81%AE%E6%9B%B8%E5%87%BA%E3%81%97%E3%81%A7%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%83%8E%E3%82%A4%E3%82%BA%E3%81%8C%E5%87%BA%E3%82%8B%E5%A0%B4%E5%90%88%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99/td-p/11932822?profile.language=ja

>参考2
>DaVinci Resolveの書き出し(レンダー)でブロックノイズが出た時の対処法
>https://note.com/0cello/n/n250b6675e8db

参考2のとおりにH.265で書き出したらブロックノイズは無くなったが、twitterはH.264しか対応していないのでそのままではアップロードができない。
対処法として、ffmpegを使ってコーデックをを変換した

10bit H.265 → 10bit H.264の場合
`ffmpeg -i input.mp4 -c:v libx264 -crf 18 -c:a copy output.mp4`
10bit H.265 → 8bit H.264の場合
`ffmpeg -i input.mp4 -c:v libx264 -crf 18 -vf format=yuv420p -c:a copy output.mp4`

ffmpegが何かわからない人は[HandBrake](https://handbrake.fr/)でも同じようなコーデック変換ができるようなのでそっちでもいいかも。

これが最善かは不明だが、お手軽だし見た感じ劣化も無いようなのでよしとする。