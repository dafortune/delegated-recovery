Crypto utils
============
We will use these tools to encrypt data used in the token. For now we will
use encrypted [iron](https://github.com/hueniverse/iron#introduction) token
as the tool to encrypt the tokens. This tools probably exceeds the requirements
we need; for example, it provides integrity check witch is already provided
by the token signature. Alternatives for it will be accepted, however, whichever
alternative you propose it must at least comply the following properties:

- Support password rotation.
- Use a random iv.
- Use a well-known algorithm.


