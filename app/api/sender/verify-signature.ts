import stringify from "json-stable-stringify";

let loadedSenderPublicKey: CryptoKey | undefined = undefined;

function hexStringToBytes(hexString: string): ArrayBuffer {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const buffer = new ArrayBuffer(hexString.length / 2);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  return buffer;
}

async function senderPublicKey() {
  if (loadedSenderPublicKey) {
    return loadedSenderPublicKey;
  }

  if (!process.env.SENDER_PUBLIC_KEY || process.env.SENDER_PUBLIC_KEY === "") {
    throw new Error("No sender public key set");
  }

  loadedSenderPublicKey = await crypto.subtle.importKey(
    "jwk", // format
    JSON.parse(process.env.SENDER_PUBLIC_KEY!), // the public key in JWK format
    {
      name: "ECDSA",
      namedCurve: "P-521", // or "P-384", "P-521" depending on your curve
    }, // algorithm
    true, // extractable
    ["verify"] // key usages
  );
  return loadedSenderPublicKey;
}

export async function validateDigitalSignature(
  obj: object,
  receivedSignature: string
) {
  return await crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-512" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    await senderPublicKey(), //from generateKey or importKey above
    hexStringToBytes(receivedSignature), //ArrayBuffer of the data
    Buffer.from(stringify(obj), "utf-8")
  );
}
