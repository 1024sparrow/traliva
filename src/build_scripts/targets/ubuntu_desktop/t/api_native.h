#ifndef API_H
#define API_H

#include <QObject>
#include <QMap>

class QWebView;
class QProcess;
class ApiNative : public QObject
{
    Q_OBJECT
public:
    ApiNative(QWebView *wv);
    [ code here: public ]
private slots:
    [ code here: private slots ]
private:
    QWebView *webView;
    QMap<QString, QProcess *> processByInputFunctionMap;
};

#endif // API_H
