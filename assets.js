function parse(inputArray) {
    // @TODO
    // 1. retrieve list from https://api.fliplet.com/v1/widgets/assets
    // 		note: you may need to use a CORS proxy
    // 2. parse the inputArray into a list of assets using the above list
    return fetch("https://cors-anywhere.herokuapp.com/https://api.fliplet.com/v1/widgets/assets")
        .then((response) => response.json())
        .then((data) => {
            let assets = [];
    
            Object.keys(data.assets).forEach(key => {
                if (inputArray.indexOf(key) != -1) {
                    let {latestVersion} = data.assets[key];
                
                    assets.push(
                        ...data.assets[key]['versions'][latestVersion]
                    );
                }
            })

            return Promise.resolve(assets);
        })
        .catch(err => {
            console.log(JSON.stringify(err));
        })
  }
  
  
  parse(['bootstrap', 'fliplet-core', 'moment', 'jquery'])
    .then(function (assets) {
        console.log('The list is', assets);
    });