/** Mini barramento para sincronizar: cena 3D pronta → abertura termina → hero anima. */
type Callback = () => void;

const state = { sceneReady: false, introDone: false };
const readySubs = new Set<Callback>();
const doneSubs = new Set<Callback>();

export function markSceneReady() {
  if (state.sceneReady) return;
  state.sceneReady = true;
  readySubs.forEach((cb) => cb());
  readySubs.clear();
}

export function onSceneReady(cb: Callback): () => void {
  if (state.sceneReady) {
    cb();
    return () => {};
  }
  readySubs.add(cb);
  return () => {
    readySubs.delete(cb);
  };
}

export function markIntroDone() {
  if (state.introDone) return;
  state.introDone = true;
  doneSubs.forEach((cb) => cb());
  doneSubs.clear();
}

export function onIntroDone(cb: Callback): () => void {
  if (state.introDone) {
    cb();
    return () => {};
  }
  doneSubs.add(cb);
  return () => {
    doneSubs.delete(cb);
  };
}
