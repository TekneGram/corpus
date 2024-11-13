#include <string>
#include <vector>
#include <iostream>
#include <fstream>
#include "punctuation.h"
#include "./lib/json.hpp"
#include <sqlite3.h>

// But imagine if we could build the collocation lists here! It could be done in one go!
void parser (
    const std::string& text, 
    std::vector<std::string>& wordlist, 
    std::vector<std::string>& collList,
    std::vector<std::string>& threeBundleList,
    std::vector<std::string>& fourBundleList
)
{
    std::string word { };
    std::string coll { };
    std::string threeBundle { };
    std::string fourBundle { };

    // Using an iterator lets me detect when I have reached the end of the string
    for (auto iterator = text.begin(); iterator != text.end(); ++iterator)
    {   
        const char c = *iterator; // not strictly a dereference since iterator is not a pointer, but it acts like dereference
        if (!Punctuation::isPunctuation(c)) // unordered set so it has lookup complexity of O(1)
        {
            word += c;
            coll += c;
            threeBundle += c;
            fourBundle += c;
        }

        if (c == ' ' || std::next(iterator) == text.end())
        {

            if (fourBundle != threeBundle)
            {
                fourBundleList.push_back(fourBundle);
                fourBundle = threeBundle;
            }

            if (threeBundle != coll)
            {
                threeBundleList.push_back(threeBundle);
                threeBundle = coll;
            }

            if (coll != word)
            {
                collList.push_back(coll);
                coll = word;
            }

            wordlist.push_back(word);
            word = {};

        }
    }
}


int main ()
{
    std::string text;
    std::getline(std::cin, text);

    std::vector<std::string> wordlist { }; // initialize an empty word list
    std::vector<std::string> collList { };
    std::vector<std::string> threeBundleList { };
    std::vector<std::string> fourBundleList { };

    std::string line;
    std::string allContent;
    
    parser(text, wordlist, collList, threeBundleList, fourBundleList);

    std::cout << wordlist.size() << " " << collList.size() << " " << threeBundleList.size() << " " << fourBundleList.size() << std::endl;

}