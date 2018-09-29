#include "api_native.h"
#include <QProcess>
#include <QWebView>
#include <QWebFrame>
#include <QDebug>

//static QProcess *CHILD_PROCESS = 0;

ApiNative::ApiNative(QWebView *wv)
    :QObject(wv), webView(wv)
{
    //
}

int ApiNative::sum(int p_a, int p_b)
{
    return p_a + 3 * p_b;
}

int ApiNative::startPlayer()
{
    QProcess *process = new QProcess(this);
    connect(process, SIGNAL(finished(int)), this, SLOT(playerFinished(int)));
    ss.insert((size_t)process, "playerChanged");//%%%
    connect(process, SIGNAL(readyReadStandardOutput()), this, SLOT(onReadyReadStandardOutput()));//%%%%
    process->start("/home/user/da/pro/projects/qt4webkit/web_content/utils/1.sh");
    //qDebug()<<"dsfghjkl;";
    return 0;
}

void ApiNative::setToPlayer(const char *)
{
    //
}

void ApiNative::playerChanged(const char *)
{
    //
}

void ApiNative::playerFinished(int p_exitCode)
{
    //
}

void ApiNative::onReadyReadStandardOutput()
{
    QProcess *process = (QProcess *)(sender());
    QString funcName = ss.value((size_t)process);
    if (funcName.isEmpty())
        return;//%%%
    while(!process->atEnd())
    {
        QString str = QString(process->readLine().constData())
                .replace('\n', "")
                .replace('\'', "\\\'")
                .replace('\"', "\\\"")
                ;
        str = QString("api.%1(\'%2\');").arg(funcName).arg(str);
        webView->page()->mainFrame()->evaluateJavaScript(str);
    }
    return;
}
