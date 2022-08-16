
export function base64ToUint8Array(base64: string) {
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

export function Uint8ArrayToBase64(buf: Uint8Array) {
  return Buffer.from(buf).toString('base64');
}

function bufferToUint8(buf: Buffer) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return view;
}

export function encodeArrayForSDK(decodedArray: (number | string)[]) {
  if (!decodedArray) {
    return decodedArray;
  }
  const encoder = new TextEncoder();
  return decodedArray.map((value) => {
    if (typeof value === 'number') {
      return uint64ToBigEndian(value);
    }
    return encoder.encode(value);
  });
}

export function uint64ToBigEndian(x: number) {
  const buff = Buffer.alloc(8);
  buff.writeUIntBE(x, 2, 6); // TODO: check this when we handle bigger numbers (actual uint64, possibly with bigint)
  return bufferToUint8(buff);
}

// export function encodeArrayForSigner(decodedArray) {
//   if (!decodedArray) {
//     return decodedArray;
//   }
//   return decodedArray.map((value) => {
//     if (typeof value === 'number') {
//       return btoa(String.fromCharCode.apply(null, uint64ToBigEndian(value)));
//     }
//     return btoa(value);
//   });
// }
