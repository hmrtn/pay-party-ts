interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_INFURA_IPFS_PROJECT_ID: string;
  readonly VITE_APP_INFURA_IPFS_PROJECT_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
