with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  shellHook = ''
    npm install

    echo -e "\e[32m\e[1m Start Chromium with remote debuging"
    chromium --remote-debugging-port=9222 https://localhost:8000 &> ./chromium.log &

    echo -e "\e[32m\e[1m Start gulp runner"
    gulp


'';
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    git
    chromiumBeta
    nodejs
    nodePackages.tern
    nodePackages.gulp
  ];
}
