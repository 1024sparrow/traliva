#ifndef API_H
#define API_H

#include <QObject>

class ApiNative : public QObject
{
    Q_OBJECT
public:
    // from JS to C++
    Q_INVOKABLE int sum(int p_a, int p_b);
};

#endif // API_H
