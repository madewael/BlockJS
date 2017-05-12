# BlockJS

In this project I build a very simple blockchain in JS.
This is a toy project with the aim to make it easy to experiment with e.g., proof-of-work versus proof-of-elapsed-time.

The project consits of one 'main' server to which clients (browsers) can connect. They then download the longest chain, and broadcast potential changes.
Currently, all communication hapens over the shared server, but this could be remedied.

