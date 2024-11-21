import React from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { geCategories } from "../data/getData";

class CoursesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null
    };
  }

  renderCategoryList() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {geCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => this.setState({ selectedCategory: category })}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start space-x-4">
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Book className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold mb-2">
                    Area {category.id}
                  </h2>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {category.units} units
                  </span>
                </div>
                <p className="text-gray-600">{category.name}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                View Courses
                <ChevronRight size={16} className="ml-1" />
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  renderCategoryDetails() {
    const { selectedCategory } = this.state;
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <button 
            onClick={() => this.setState({ selectedCategory: null })}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronRight className="rotate-180 mr-1" size={20} />
            Back to Categories
          </button>
          <h2 className="text-2xl font-semibold">
            Area {selectedCategory.id}: {selectedCategory.name}
          </h2>
          <p className="text-gray-600 mt-2">{selectedCategory.units} units required</p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((course) => (
            <div 
              key={course}
              className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Course {course}</h3>
                  <p className="text-gray-600">Course Description</p>
                </div>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  3 units
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { selectedCategory } = this.state;
    return selectedCategory ? this.renderCategoryDetails() : this.renderCategoryList();
  }
}

export default CoursesComponent;
