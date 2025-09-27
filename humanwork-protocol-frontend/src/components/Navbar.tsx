interface NavbarProps {
  account: string | null;
  connectWallet: () => Promise<void>;
  onShowProfile: () => void;
}

const Navbar = ({ account, connectWallet, onShowProfile }: NavbarProps) => {
  return (
    <nav className="w-full flex justify-end p-4">
      {account ? (
        <p className="text-gray-700 mr-4">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
      {account && (
        <button
          className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={onShowProfile}
        >
          Profile
        </button>
      )}
    </nav>
  );
};

export default Navbar;
