# Tagflip UI

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/69a2246a1acf4825b682f2f38ca06082)](https://app.codacy.com/gh/fhswf/tagflip-gui?utm_source=github.com&utm_medium=referral&utm_content=fhswf/tagflip-gui&utm_campaign=Badge_Grade)

[Tagflip](https://jupiter.fh-swf.de/tagflip) is an online tagging tool similar to [BRAT](https://brat.nlplab.org/) or [WebAnno](https://webanno.github.io/webanno/).

## Why another online tagging tool?
While BRAT is rather lightweight, it runs only on UNIX-like environments and is a little outdated (Python 2.5 and CGI interface).
WebAnno is actively maintained, but it uses a UI based on Whicket and the code is quite complex.

Tagflip consists of a Node.js backend (which can be deployed as a docker container, if you like) and a lightweight React frontend. 
