# Tagflip UI

[Tagflip](https://jupiter.fh-swf.de/tagflip) is an online tagging tool similar to [BRAT](https://brat.nlplab.org/) or [WebAnno](https://webanno.github.io/webanno/).

## Why another online tagging tool?
While BRAT is rather lightweight, it runs only on UNIX-like environments and is a little outdated (Python 2.5 and CGI interface).
WebAnno is actively maintained, but it uses a UI based on Whicket and the code is quite complex.

Tagflip consists of a Node.js backend (which can be deployed as a docker container, if you like) and a lightweight React frontend. 
