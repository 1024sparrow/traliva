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
    // from JS to C++
    Q_INVOKABLE int sum(int p_a, int p_b);

    Q_INVOKABLE int startPlayer();
    Q_INVOKABLE void setToPlayer(const QString &);

private slots:
    void playerChanged(const char *);
    void playerFinished(int p_exitCode);

    void onReadyReadStandardOutput();

private:
    QWebView *webView;
    QMap<QString, QProcess *> processByInputFunctionMap;
};

#endif // API_H
