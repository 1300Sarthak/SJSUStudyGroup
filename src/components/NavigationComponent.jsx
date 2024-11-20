import React from 'react';
import { navigationItems } from '/Users/sarthak/Documents/sjsu-study-group/src/data/getData';

class NavigationComponent extends React.Component {
  render() {
    const { activeTab, onTabChange, showProfile } = this.props;

    return (
      <nav className="col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id && !showProfile
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavigationComponent;
