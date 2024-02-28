export namespace QuaternionUtils {
  export type Quaternion = {
    x: number;
    y: number;
    z: number;
    w: number;
  };

  function roundValue(value: number, decimals: number): number {
    return parseFloat(value.toFixed(decimals));
  }

  export function init(quaternion: Quaternion, x = 0, y = 0, z = 0, w = 1): void {
    quaternion.x = roundValue(x, 4);
    quaternion.y = roundValue(y, 4);
    quaternion.z = roundValue(z, 4);
    quaternion.w = roundValue(w, 4);
  }

  export function setFromAxisAngle(
    quaternion: Quaternion,
    axis: { x: number; y: number; z: number },
    angle: number
  ): void {
    // Normalize the axis
    const axisLength = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    const normalizedAxis = {
      x: roundValue(axis.x / axisLength, 5),
      y: roundValue(axis.y / axisLength, 5),
      z: roundValue(axis.z / axisLength, 5),
    };

    const halfAngle = angle / 2;
    const sinHalfAngle = Math.sin(halfAngle);

    quaternion.x = roundValue(normalizedAxis.x * sinHalfAngle, 4);
    quaternion.y = roundValue(normalizedAxis.y * sinHalfAngle, 4);
    quaternion.z = roundValue(normalizedAxis.z * sinHalfAngle, 4);
    quaternion.w = roundValue(Math.cos(halfAngle), 4);
  }

  export function normalize(quaternion: Quaternion): void {
    const length = Math.sqrt(
      quaternion.x * quaternion.x +
        quaternion.y * quaternion.y +
        quaternion.z * quaternion.z +
        quaternion.w * quaternion.w
    );

    if (length < Number.EPSILON) {
      quaternion.x = 0;
      quaternion.y = 0;
      quaternion.z = 0;
      quaternion.w = 1;
    } else {
      quaternion.x /= length;
      quaternion.y /= length;
      quaternion.z /= length;
      quaternion.w /= length;
    }
  }

  export function multiply(q1: Quaternion, q2: Quaternion, result: Quaternion): void {
    const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
    const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
    const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
    const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
  }

  export function rotateVector(
    quaternion: Quaternion,
    vector: { x: number; y: number; z: number },
    result: { x: number; y: number; z: number }
  ): void {
    const q = quaternion;
    const ix = q.w * vector.x + q.y * vector.z - q.z * vector.y;
    const iy = q.w * vector.y + q.z * vector.x - q.x * vector.z;
    const iz = q.w * vector.z + q.x * vector.y - q.y * vector.x;
    const iw = -q.x * vector.x - q.y * vector.y - q.z * vector.z;

    result.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
    result.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
    result.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
  }

  export function toEulerAngles(quaternion: Quaternion): { x: number; y: number; z: number } {
    // roll (x-axis rotation)
    const sinr_cosp = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
    const cosr_cosp = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    // pitch (y-axis rotation)
    const sinp = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
    let pitch: number;
    if (Math.abs(sinp) >= 1) {
      // use 90 degrees if out of range
      pitch = Math.sign(sinp) * (Math.PI / 2);
    } else {
      pitch = Math.asin(sinp);
    }

    // yaw (z-axis rotation)
    const siny_cosp = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
    const cosy_cosp = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    return { x: roll, y: pitch, z: yaw };
  }

  export function angleBetween(q1: Quaternion, q2: Quaternion): number {
    // Quaternion dot product
    const dotProduct = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

    // The dot product of two quaternions is the cosine of the angle between them
    // So, the angle between two quaternions is the arc cosine of the dot product
    return Math.acos(Math.min(Math.max(dotProduct, -1), 1)) * (180 / Math.PI);
  }

  export function slerp(qa: Quaternion, qb: Quaternion, t: number, result: Quaternion): void {
    // Calculate angle between them.
    let cosHalfTheta = qa.x * qb.x + qa.y * qb.y + qa.z * qb.z + qa.w * qb.w;

    // if qa=qb or qa=-qb then theta = 0 and we can return qa
    if (Math.abs(cosHalfTheta) >= 1.0) {
      result.x = qa.x;
      result.y = qa.y;
      result.z = qa.z;
      result.w = qa.w;
      return;
    }

    // Calculate temporary values.
    let halfTheta = Math.acos(cosHalfTheta);
    let sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    // if theta = 180 degrees then result is not fully defined
    // we could rotate around any axis normal to qa or qb
    if (Math.abs(sinHalfTheta) < 0.001) {
      result.x = qa.x * 0.5 + qb.x * 0.5;
      result.y = qa.y * 0.5 + qb.y * 0.5;
      result.z = qa.z * 0.5 + qb.z * 0.5;
      result.w = qa.w * 0.5 + qb.w * 0.5;
      return;
    }

    let ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    let ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    // Calculate Quaternion.
    result.x = qa.x * ratioA + qb.x * ratioB;
    result.y = qa.y * ratioA + qb.y * ratioB;
    result.z = qa.z * ratioA + qb.z * ratioB;
    result.w = qa.w * ratioA + qb.w * ratioB;
  }
}
