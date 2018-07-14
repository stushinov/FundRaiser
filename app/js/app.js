const fundFactoryAddress = '0xca4258048c938de566b6dd9449FA9B3a36f4EAA6';
const contractFactoryAbi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getContractByIndex",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_data",
                "type": "string"
            },
            {
                "name": "expirationTime",
                "type": "uint256"
            },
            {
                "name": "goal",
                "type": "uint256"
            }
        ],
        "name": "createTimedFund",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "contractAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_by",
                "type": "address"
            }
        ],
        "name": "ContractCreated",
        "type": "event"
    }
];

const identifiableAba = [
    {
        "constant": true,
        "inputs": [],
        "name": "getType",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const timedFundAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Donation",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "refund",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_data",
                    "type": "string"
                }
            ],
            "name": "setData",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawal",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_data",
                    "type": "string"
                },
                {
                    "name": "_expires",
                    "type": "uint256"
                },
                {
                    "name": "_target",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "data",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "expires",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getAddress",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_ofAddress",
                    "type": "address"
                }
            ],
            "name": "getDonations",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getType",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "raised",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "target",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

const notificationsDiv = $('#notifications');

const notifications = {
    creationSuccess: function (txHash) { return "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n" +
    "  <strong>Fund successfully created!</strong> Transaction: <a href=\"https://ropsten.etherscan.io/tx/"+ txHash +"\"> "+ txHash +" </a> \n" +
    "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
    "    <span aria-hidden=\"true\">&times;</span>\n" +
    "  </button>\n" +
    "</div>"
    },

    error: function (err) {
       return "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
        "  "+err +"  \n" +
        "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
        "    <span aria-hidden=\"true\">&times;</span>\n" +
        "  </button>\n" +
        "</div>"
    },

    found: function (addr) {
        return "<div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n" +
            "  <strong>Found: </strong> Contract: "+ addr + " \n" +
            "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
            "    <span aria-hidden=\"true\">&times;</span>\n" +
            "  </button>\n" +
            "</div>"
    }
};

const views = {
    home: "<div class=\"jumbotron text-center\">\n" +
    "                <h1>Welcome to FundRaiser!</h1>\n" +
    "                <h3>A place where you can raise funds!</h3>\n" +
    "            </div>",
    about: "<div class=\"jumbotron text-center\">\n" +
    "                <h1>About page</h1>\n" +
    "                <h3>Nothing special here</h3>\n" +
    "            </div>",
    createContract: "<h2 class='display-3 text-center mb-2'>Create fund</h2>" +
    "<div class='pt-2 pb-2 pl-5 pr-5 text-center' style='background-color: rgba(176,178,171,0.08)'>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"fundHeading\">Heading</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"fundHeading\" placeholder=\"Heading of your fund\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"fundContent\">Description</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"fundContent\" placeholder=\"Heading of your fund\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"expirationTime\">Expiration time</label>\n" +
    "    <input type=\"text0\" class=\"form-control\" id=\"expirationTime\" placeholder=\"Enter seconds until expiration\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"goal\">Goal</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"goal\" placeholder=\"How much eth do you want to gather\">\n" +
    "  </div>\n" +
    "  <button id=\"createFund\" class=\"btn btn-primary\">Create</button>\n" +
    "</div>"
};

const mainDiv = $('#mainContent');

$(function () {

    renderView(views.home);

    $('#goHome').click(function () {
        renderView(views.home);

    });

    $('#about').click(function () {
        renderView(views.about);
        alert('Heelo?');

    });

    $('#fundCreateForm').click(function () {
        renderView(views.createContract);

        $('#createFund').click(function () {
            createFund();
        });
    });

    $('#searchButton').click(function () {
        let address = $('#findAddress').val();
        let view = findOneByAddress(address);
        renderView(view);
    });

    $('#listFunds').click(function () {
        listAll();
    });
});

function findOneByAddress(address){
    if (typeof web3 === 'undefined') {
        notify(notifications.error('Web3 is undefined!'));
        return;
    }
    let type;
    let identifiable;
    try {
        identifiable = web3.eth.contract(identifiableAba).at(address);
    }
    catch (e) {
        notify(notifications.error("No such contract!"));
        return;
    }
    identifiable.getType((err, res) => {
        if (err) {
            notify(notifications.error("No such contract!"));
            return;
        }
        notify(notifications.found(address));
    });
    let rendered = renderContract(address);
    return rendered;
}

function listAll() {
    //Not implemented
}

function renderContract(addr){
    let contract = web3.eth.contract(timedFundAbi).at(addr);

    let contractData = getContractData(contract);
    let createdBy = getOwner(contract);
    let target = getTarget(contract);
    let raised = getRaised(contract);

    return "<div class=\"jumbotron\">\n" +
        "    <h2>Fund: "+ addr +" </h2>\n" +
        "    <h3>Created by: "+ createdBy +" </h3>\n" +
        "    <h3>Data: "+ contractData +" </h3>\n" +
        "    <h3>Target: "+ target +" </h3>\n" +
        "    <h3>Raised: "+ raised + " </h3>\n" +
        "</div>"
}

function getRaised(contract) {
    let result;
    contract.raised((err, res) => {
        if(err){
            notify(notifications.error(err));
        }
        result = res;
    });

    return result;
}

function getTarget(contract) {
    let result;
    contract.target((err, res) => {
        if(err){
            notify(notifications.error(err));
        }
        result = res;
    });

    return result;
}

function getOwner(contract) {
    let result;
    contract.owner((err, res) => {
        if(err){
            notify(notifications.error(err));
        }
        result = res;
    });

    return result;
}

function getContractData(contract) {
    let result;
    contract.data((err, res) => {
        if(err){
            notify(notifications.error(err));
        }
        result = res;
    });

    return result;
}

function createFund() {

    if (typeof web3 === 'undefined') {
        notify(notifications.error('Web3 is undefined!'));
        return;
    }

    let fund = {
        heading: $('#fundHeading').val(),
        content: $('#fundContent').val(),
        expires: $('#expirationTime').val(),
        goal: $('#goal').val()
    };

    let fundString = JSON.stringify(fund);
    let hash = CryptoJS.SHA256(fundString);


    let contractData = hash.toString();
    let contractTime = fund.expires;
    let contractGoal = fund.goal;

    let contract = web3.eth.contract(contractFactoryAbi).at(fundFactoryAddress);
    contract.createTimedFund(contractData, contractTime, contractGoal, (err, txHash) => {
            if (err) {
                notify(notifications.error(err));
                return;
            }
            notify(notifications.creationSuccess(txHash));
    });
}

function notify(event) {
   notificationsDiv.empty();
   notificationsDiv.append(event);
}

function renderView(view) {
    mainDiv.empty();
    mainDiv.append(view);
}