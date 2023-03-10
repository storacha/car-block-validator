import { sha256, sha512 } from 'multiformats/hashes/sha2'
import { murmur3128, murmur332 } from '@multiformats/murmur3'
import { blake2b256 } from '@multiformats/blake2/blake2b'
import { blake2s256 } from '@multiformats/blake2/blake2s'
import {
  sha3224,
  sha3256,
  sha3384,
  sha3512,
  shake128,
  shake256,
  keccak224,
  keccak256,
  keccak384,
  keccak512
// @ts-expect-error types not well published
} from '@multiformats/sha3'
import { equals } from 'uint8arrays'

/**
 * @typedef {object} Block
 * @property {import('multiformats/cid').CID} cid
 * @property {Uint8Array} bytes
 */

/**
 * Validates IPLD block bytes.
 * @param {Block} block
 */
export async function validateBlock (block) {
  const hasher = getHasher(block.cid.multihash.code)
  const bytesHash = await hasher.digest(block.bytes)

  if (!equals(bytesHash.digest, block.cid.multihash.digest)) {
    throw new Error(`block with cid ${block.cid.toString()} does not have valid bytes`)
  }
}

/**
 * @param {number} multihashCode
 */
function getHasher (multihashCode) {
  switch (multihashCode) {
    case sha256.code:
      return sha256
    case sha512.code:
      return sha512
    case murmur3128.code:
      return murmur3128
    case murmur332.code:
      return murmur332
    case blake2b256.code:
      return blake2b256
    case blake2s256.code:
      return blake2s256
    case sha3224.code:
      return sha3224
    case sha3256.code:
      return sha3256
    case sha3384.code:
      return sha3384
    case sha3512.code:
      return sha3512
    case shake128.code:
      return shake128
    case shake256.code:
      return shake256
    case keccak224.code:
      return keccak224
    case keccak256.code:
      return keccak256
    case keccak384.code:
      return keccak384
    case keccak512.code:
      return keccak512
    default:
      throw new Error(`multihash code ${multihashCode} is not supported`)
  }
}
