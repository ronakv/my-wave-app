import React, {useEffect, useState} from "react";
import ethers from "ethers";
import "./App.css";
import abi from './utils/WavePortal.json'


const ConnectOrWelcome = (props) =>{

    console.log('In component')
    const styles = {
        marginTop: 16,
        padding: 8,
        border: 0,
        borderRadius: 5
    }

    if(props.userFound){
        return (
            <div>
                Welcome Back {props.userAccount}
            </div>
        )
    }
    else{
        return(
            <div style = {styles}>
                <button className="connectWalletButton" onClick={props.onClick}>
                    Connect Wallet
                </button>
            </div>
        )
    }
}


const App = () => {

    const [account, setCurrentAccount] = useState("");
    const [accountFound, toggleAccountFound] = useState(false);

    const contractAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    const contractABI = abi.abi;


    const checkIfWalletIsConnected = async () => {
        /*
        * First make sure we have access to window.ethereum
        */
        const { ethereum } = window;



        if (!ethereum) {
            console.log("Make sure you have metamask!");
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({method: "eth_accounts"});

        if(accounts.length > 0){
            setCurrentAccount(accounts[0]);
            toggleAccountFound(true);
            console.log('Found an account')
        }
        else{
            toggleAccountFound(false);
            console.log('No Account found')
        }
    }

    const connectWallet = async () =>{
        try{
            const {ethereum} = window;
            if(!ethereum){
                console.log('Get MetaMask')
            }
            else{
                const accounts = await ethereum.request({method:"eth_requestAccounts"});
                setCurrentAccount(accounts[0]);
                console.log('Account found : ', accounts[0]);
            }
        }

        catch(error){
            console.log(error)
        }
    }

    const wave = async () =>{
        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
                let count = await wavePortalContract.getTotalWaves();
                console.log("Total waves: ", count.toNumber());
            }
            else{
                console.log('Ethereum Object not found')
            }
        }
        catch (error){
            console.log(error)
        }
    }


    /*
    * This runs our function when the page loads.
    */
    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    console.log('This state is :', accountFound)
    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    👋 Hey there!
                </div>

                <div className="bio">
                    I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
                </div>

                <button className="waveButton" onClick={wave}>
                    Wave at Me
                </button>
                <ConnectOrWelcome userFound = {accountFound} userAccount = {account} onClick = {connectWallet}/>
            </div>
        </div>
    );
}

export default App