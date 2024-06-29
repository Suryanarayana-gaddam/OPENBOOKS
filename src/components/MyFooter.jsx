import { Link } from 'react-router-dom';

const MyFooter = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 lg:px-24">
            <div className="container mx-auto flex justify-between items-center">
                <p className="text-sm ml-3"><a href="#">© 2024 OPENBOOKS</a></p>
                <ul className="flex space-x-4 mr-6">
                    <li><a href="/">Home</a></li>
                    <li><Link to="/about">About</Link></li>
                    <li><a href="/">Services</a></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
        </footer>
    );
};

export default MyFooter;
