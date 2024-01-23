export default function noAuthDev(): boolean {
  const noAuth = process.env.NO_AUTH;

  return noAuth?.toLowerCase() === 'true';
}
