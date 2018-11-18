import fs from 'mz/fs'
import jwt from 'jsonwebtoken'
import { publicKeyPath, jwtAlgorithm } from 'utils/config'

function promiseVerify (token, cert, options) {
  return new Promise(function (resolve, reject) {
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    jwt.verify(token, cert, options, function (err, payload) {
      if (err) resolve({ error: true, err })
      else resolve({ error: false, payload })
    })
  })
}

export default async function (req, res, next) {
  let auth = req.headers['authorization']
  if (auth) {
    auth = auth.split(' ')
    if (auth[0] === 'Bearer') {
      try {
        const cert = await fs.readFile(publicKeyPath)
        const verify = await promiseVerify(auth[1], cert, { algorithm: jwtAlgorithm })
        if (!verify.error) { // token is not expired and signature checks
          req.auth = verify.payload
          next()
        } else if (verify.err.message === 'jwt-expired') { // token is expired and client is warned.
          res.status(401).send({ errors: [{ message: 'The provided access token is expired. A new token must be issued.', extensions: { code: 'EXPIRED_ACCESS_TOKEN' } }] })
        } else { // token is invalid
          res.status(401).send({ errors: [{ message: 'The access token could not be verified.', extensions: { code: 'ACCESS_TOKEN_NOT_VERIFIED' } }] })
        }
      } catch (error) { // unexpected error in fs or jwt.verify
        res.status(500).send({ errors: [{ message: 'Unexpected error.', extensions: { code: 'INTERNAL_SERVER_ERROR' } }] })
      }
    } else { // token is invalid
      res.status(401).send({ errors: [{ message: 'The access token could not be verified.', extensions: { code: 'ACCESS_TOKEN_NOT_VERIFIED' } }] })
    }
  } else { // no token sent
    next()
  }
}
