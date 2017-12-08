with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  shellHook = ''
    npm install
    cd submodules/dat.gui
    npm install
    cd -

    echo -e "\e[32m Start Chromium with remote debuging"
    # chromium --remote-debugging-port=9222 https://localhost:8000 &> ./chromium.log &

    echo -e "\e[32m To start task runner, type \e[1mgulp\e[0m"



'';
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    git
    xautomation
    # chromiumBeta
    nodejs

  ];
}
