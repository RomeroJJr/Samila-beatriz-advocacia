// Permite `import src from './file.glsl'` (string bruta) no TypeScript.
declare module '*.glsl' {
  const source: string;
  export default source;
}
declare module '*.vert' {
  const source: string;
  export default source;
}
declare module '*.frag' {
  const source: string;
  export default source;
}
declare module '*.vs' {
  const source: string;
  export default source;
}
declare module '*.fs' {
  const source: string;
  export default source;
}
