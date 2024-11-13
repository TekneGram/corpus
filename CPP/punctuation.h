#include <unordered_set>

#ifndef PUNCTUATION_H // Prevents the header file from being included more than once
#define PUNCTUATION_H


namespace Punctuation
{
    constexpr char period {'.'};
    constexpr char comma {','};
    constexpr char qm {'?'};
    constexpr char excm {'!'};
    constexpr char quotm {'"'};
    constexpr char colon {':'};
    constexpr char semicolon {';'};
    constexpr char percent {'%'};
    constexpr char openpar {'('};
    constexpr char closepar {')'};
    constexpr char openbracket {'{'};
    constexpr char closebracket {'}'};

    // An unordered set has O(1) lookup time, so it is very efficient
    const std::unordered_set<char> all_punctuation {
        period, comma, qm, excm, quotm, semicolon, percent,
        openpar, closepar, openbracket, closebracket
    };

    bool isPunctuation(char c) {
        return all_punctuation.find(c) != all_punctuation.end();
    }
}

#endif