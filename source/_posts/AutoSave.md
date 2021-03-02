---
title: 【Houdini】起動時に自動でオートセーブを有効にする
categories: blog
#cover_index: /assets/AutoSave/450.webp
date: 2021-02-15 20:44:31
tags: Houdini
hidden: true
---
## はじめに
![2021-02-15T204726](2021-02-15T204726.png)  
Houdiniのオートセーブはソフトを再起動する度にオフになる仕様．なんでや．  
HoudiniがクラッシュするときはTempファイルが作成されるのでサルベージできるけど，応答が無くなるとそうもいかないのでオートセーブを忘れていたときがつらい．  
ので，Houdini Startup Scriptsなるものを使って起動時にオートセーブを有効にする．

Houdini Startup Scriptsについて詳しく知りたい人は以下を参照．  
[Houdini Startup Scripts - サルにもわかるHoudini](http://ikatnek.blogspot.com/p/houdini-startup-scripts.html)



## 手順

scriptsというフォルダを ~houdini18.5/scripts のように作成する．  
ここで ~ はホームフォルダのこと．わからなければ File> Open等からHome Folderを確認．  
自分の場合は E:\Users\ユーザー名\Documents\houdini18.5\scripts となった．  
![2021-02-15T210744](2021-02-15T210744.png)  

そして以下を記入したテキストファイルを ~houdini18.5/scripts/456.py として保存すれば完了．
```python
import hou
hou.hscript('autosave on')
```
<br>


これでオートセーブを有効にし忘れることがなくなった．嬉しい．  
![2021-02-15T211224](2021-02-15T211224.png)