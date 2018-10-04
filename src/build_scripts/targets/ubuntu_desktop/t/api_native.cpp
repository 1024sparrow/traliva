#include "api_native.h"
#include <QProcess>
#include <QWebView>
#include <QWebFrame>
#include <QDebug>
#include <QTextStream>

//static QProcess *CHILD_PROCESS = 0;

extern QString M_APPDIR;

ApiNative::ApiNative(QWebView *wv)
    :QObject(wv), webView(wv)
{
    //
}

[ code here: cpp ]int ApiNative::startProcess(const QString &p_funcNameStart, const QString &p_funcNameInput, const char *slotOutput, const char *slotFinished)
{
    QProcess *process = new QProcess(this);
    process->setWorkingDirectory(M_APPDIR);
    if (slotFinished)
        connect(process, SIGNAL(finished(int)), this, slotFinished);
    if (processByInputFunctionMap.contains(p_funcNameInput))
        return -1;
    processByInputFunctionMap.insert(p_funcNameInput, process);
    if (slotOutput)
        connect(process, SIGNAL(readyReadStandardOutput()), this, slotOutput);//%%%%
    QString pa = QString("%1/%2.sh").arg(M_APPDIR).arg(p_funcNameStart);
    process->start(pa);
    return 0;
}

void ApiNative::writeToProcess(const QString &p_funcNameInput, const QString &p_data)
{
    QProcess *process = processByInputFunctionMap.value(p_funcNameInput);
    if (!process)
        return; // oops..
    QTextStream ts(process);
    ts.setCodec("utf8");
    ts << p_data;
}

void ApiNative::onReadyReadStandardOutput(const QString &p_funcName)
{
    QProcess *process = (QProcess *)(sender());
    QTextStream ts(process);
    ts.setCodec("utf8");
    //const QString p_funcName = "playerChanged";
    while(!ts.atEnd())
    {
        QString str = QString(ts.readLine().constData())
                .replace('\n', "")
                .replace('\'', "\\\'")
                .replace('\"', "\\\"")
                ;
        str = QString("api.%1(\'%2\');").arg(p_funcName).arg(str);
        webView->page()->mainFrame()->evaluateJavaScript(str);
    }
    return;
}

void ApiNative::onProcessFinished(const QString &p_funcName, int p_exitCode)
{
    QString str = QString("api.%1(%2);").arg(p_funcName).arg(p_exitCode);
    webView->page()->mainFrame()->evaluateJavaScript(str);
    processByInputFunctionMap.remove("setToPlayer");
}
