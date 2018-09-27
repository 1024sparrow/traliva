#ifndef API_H
#define API_H

#include <QObject>
#include <QMap>

class QWebView;
class ApiNative : public QObject
{
    Q_OBJECT
public:
    ApiNative(QWebView *wv);
    // from JS to C++
    Q_INVOKABLE int sum(int p_a, int p_b);

    Q_INVOKABLE int startPlayer();
    Q_INVOKABLE void setToPlayer(const char *);

private slots:
    void playerChanged(const char *);
    void playerFinished(int p_exitCode);

    void onReadyReadStandardOutput();

private:
    QWebView *webView;
    QMap<size_t, QString> ss;
};

#endif // API_H
