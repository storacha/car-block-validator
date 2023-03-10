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

export const hashMap = new Map(
  [
    sha256, sha512, murmur3128, murmur332, blake2b256, blake2s256,
    sha3224, sha3256, sha3384, sha3512, shake128, shake256,
    keccak224, keccak256, keccak384, keccak512
  ].map(hash => [hash.code, hash])
)

/**
 * Validates IPLD block bytes.
 * @param {Block} block
 */
export async function validateBlock (block) {
  const hasher = hashMap.get(block.cid.multihash.code)
  if (!hasher) {
    throw new Error(`multihash code ${block.cid.multihash.code} is not supported`)
  }

  const bytesHash = await hasher.digest(block.bytes)

  if (!equals(bytesHash.digest, block.cid.multihash.digest)) {
    throw new Error('CID hash does not match bytes')
  }
}
