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
    int startProcess(const QString &p_funcNameStart, const QString &p_funcNameInput, const char *slotOutput, const char *slotFinished);
    void writeToProcess(const QString &p_funcNameInput, const QString &p_data);
    void onReadyReadStandardOutput(const QString &p_funcName);
    void onProcessFinished(const QString &funcName, int p_exitCode);
private:
    QWebView *webView;
    QMap<QString, QProcess *> processByInputFunctionMap;
};

#endif // API_H
