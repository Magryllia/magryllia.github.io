---
title: 【Houdini】日本語入りのVEXでHoudini Expression Editorを使ってエラーが出たときの対処法
date: 2021-04-11T16:47:49+09:00
tags: Houdini
categories: blog
# cover_index: /assets/HoudiniExpressionEditor/450.webp
hidden: true
---

## 目次
<!-- toc -->

## はじめに
HoudiniのVEXをVSCodeで弄りたくなったので，以下の記事で紹介されていたHoudiniと外部エディタを同期させるアドオン[Houdini Expression Editor](http://cgtoolbox.com/houdini-expression-editor/)をインストールしてみた．

>Houdini: VEXをカスタマイズしたVS Codeで書く02 - kick the base  
>https://www.kickbase.net/entry/vex-programming-with-vscode02

<br>


しかし，外部エディタにVSCodeを登録してHoudini Expression Editorをインストール後，  
コメントに日本語が入ったVEXをEdit in External Editorすると怒られた．  

![2021-04-11T170224](2021-04-11T170224.png)

右クリック> Expression> Edit in Extarnal Editor　をクリックすると

![2021-04-11T170102](2021-04-11T170102.png)

Script Errorが発生する．なんでや．

|環境||
|:-|-|
|OS |Windows 10 Home x64|
|Houdini|18.5.408 |
|Houdini Expression Editor |1.4.8|

## 不具合の原因

Show Detailsは以下のとおり

```
Traceback (most recent call last):
  File "<stdin>", line 9, in <module>
  File "E:/Users/****/Documents/houdini18.5/packages/../SideFXLabs/18.5.408/SideFXLabs18.5/scripts/python\HoudiniExprEditor\ParmWatcher.py", line 463, in add_watcher
    data = str(selection.rawValue())
UnicodeEncodeError: 'ascii' codec can't encode characters in position 2-5: ordinal not in range(128)
```

このエラーを吐いているParmWatcher.pyはHoudini Expression Editorでインストールしたスクリプトファイルのことなので，該当箇所を見てみる．

```python
def add_watcher(selection, type_="parm"):
    """ Create a file with the current parameter contents and 
        create a file watcher, if not already created and found in hou.Session,
        add the file to the list of watched files.

        Link the file created to a parameter where the tool has been executed from
        and when the file changed, edit the parameter contents with text contents.
    """

    file_path = get_file_name(selection, type_=type_)

    if type_ == "parm":
        # fetch parm content, either raw value or expression if any
        try:
            data = selection.expression()
        except hou.OperationFailed:
            if os.environ.get("EXTERNAL_EDITOR_EVAL_EXPRESSION") == '1':
                data = str(selection.eval())
            else:
                data = str(selection.rawValue()) # ← ここ！
    elif type_ == "python_node":
        data = selection.type().definition().sections()[
            "PythonCook"].contents()
    ︙
```

rawValue関数については[公式ヘルプ](https://www.sidefx.com/ja/docs/houdini/hom/hou/Parm.html)曰く
>rawValue() → str  
>このパラメータのそのままのテキスト値を評価または展開せずに返します。 このパラメータにエクスプレッションが含まれていれば、そのエクスプレッションが返され、そうでない場合は、このパラメータのそのままのテキスト値が返されます。

<br>

メロスにはpythonがわからぬが，とりあえず同期用ファイル生成時に`selection.rawValue()`がasciiの文字コードでエラーを吐いているっぽいことはわかった．

## 対処法
エラー文でググったらそれっぽいサイトが出てきた．

>PythonのUnicodeEncodeErrorを知る  
>https://lab.hde.co.jp/2008/08/pythonunicodeencodeerror.html

<br>

要するにasciiをutf-8にキャストしてやればいいみたいなので，該当箇所を書き換えたのがこちら

```python
data = str(selection.rawValue().encode('utf_8')) # .encode('utf_8')を追加
```
ParmWatcher.pyを書き換えて保存してから再度Edit in External EditorするとちゃんとVSCodeが立ち上がった．
![2021-04-11T172112](2021-04-11T172112.png)

VSCode側でVEXを上書き保存するとHoudiniにも即時反映されるので便利．  
～おわり～