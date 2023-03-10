import test from 'ava'
import * as pb from '@ipld/dag-pb'
import { CID } from 'multiformats/cid'
import { CarWriter, CarBlockIterator } from '@ipld/car'

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

import { validateBlock } from '../src/index.js'

const hashers = [
  sha256, sha512, murmur3128, murmur332, blake2b256, blake2s256,
  sha3224, sha3256, sha3384, sha3512, shake128, shake256,
  keccak224, keccak256, keccak384, keccak512
]

const bytes = pb.encode({ Data: new Uint8Array([1, 2, 3]), Links: [] })

for (const hasher of hashers) {
  test(`can validate valid blocks and codecs with codec ${hasher.code}`, async t => {
    const hash = await hasher.digest(bytes)
    const cid = CID.create(1, pb.code, hash)

    const { writer, out } = CarWriter.create([cid])
    writer.put({ cid, bytes })
    writer.close()

    const reader = await CarBlockIterator.fromIterable(out)

    for await (const block of reader) {
      await validateBlock(block)
    }

    t.truthy(true)
  })

  test(`throws when validating blocks with bad bytes with codec ${hasher.code}`, async (t) => {
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, pb.code, hash)

    const { writer, out } = CarWriter.create([cid])
    bytes[bytes.length - 1] = bytes[bytes.length - 1] + 1 // mangle a byte
    writer.put({ cid, bytes })
    writer.close()

    const reader = await CarBlockIterator.fromIterable(out)

    for await (const block of reader) {
      t.throwsAsync(() => validateBlock(block))
    }
  })
}
