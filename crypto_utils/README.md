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

## API
### .encrypt(obj:object, password:{ id: string, secret: string }): Promise.<Buffer>
Encrypts the object and returns a promise for a buffer containing the encrypted value
it might include tampering proof but it is not needed for the delegated recovery
spec to work since the token is already signed

### .decrypt(encrypted:Buffer, passwords: Array.<{ id: string, secret: string }>): Promise.<object>
Decrypts the encrypted buffer and returns a promise for the buffer contained on it.

WARNING!: Tampering proof is not guaranteed as it is already included in the
token signature for delegated-recovery (current alg [iron] includes it but it
might not be so in future)
