const Navbar = () => {
    return (
      <nav className="flex justify-between items-center px-8 py-4 bg-red-100 border-b-2 border-red-400">
        <div className="text-2xl font-bold text-gray-800">Cognition</div>
        <ul className="flex space-x-8">
          <li>
            <a
              href="#why-better"
              className="text-lg text-gray-800 hover:text-red-500 transition-colors"
            >
              Why We're Better
            </a>
          </li>
          <li>
            <a
              href="#partner-program"
              className="text-lg text-gray-800 hover:text-red-500 transition-colors"
            >
              Partner Program
            </a>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  