import React from 'react';
import { Search } from 'lucide-react';
import NavigationComponent from './components/NavigationComponent';
import ProfileComponent from './components/ProfileComponent';
import CoursesComponent from './components/CoursesComponent';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'courses',
      showProfile: false
    };
  }

  render() {
    const { activeTab, showProfile } = this.state;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with SJSU colors */}
        <header className="bg-sjsu-blue shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img 
                  src="/sjsu-logo.png" 
                  alt="SJSU Logo" 
                  className="h-10 w-auto"
                />
                <h1 className="text-2xl font-bold text-white">SJSU Study Group Finder</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search courses..."
                    className="py-2 px-4 pr-10 rounded-lg text-gray-900 w-64 focus:ring-2 focus:ring-sjsu-gold focus:border-sjsu-gold"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
                </div>
                <button 
                  onClick={() => this.setState(prev => ({ showProfile: !prev.showProfile }))}
                  className={`px-4 py-2 rounded-lg transition-colors text-white
                    ${showProfile 
                      ? 'bg-sjsu-gold hover:bg-yellow-500' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Navigation */}
            <NavigationComponent 
              activeTab={activeTab}
              onTabChange={(tab) => this.setState({ activeTab: tab, showProfile: false })}
              showProfile={showProfile}
            />

            {/* Main Content Area */}
            <div className="col-span-9">
              {showProfile ? (
                <ProfileComponent />
              ) : (
                activeTab === 'courses' && <CoursesComponent />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-sjsu-gold">Home</a></li>
                  <li><a href="#" className="hover:text-sjsu-gold">About</a></li>
                  <li><a href="#" className="hover:text-sjsu-gold">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-sjsu-gold">SJSU Portal</a></li>
                  <li><a href="#" className="hover:text-sjsu-gold">Canvas</a></li>
                  <li><a href="#" className="hover:text-sjsu-gold">Library</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-sjsu-gold">Discord</a></li>
                  <li><a href="#" className="hover:text-sjsu-gold">Instagram</a></li>
                  <li><a href="#" className="hover:text-sjsu-gold">Twitter</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;