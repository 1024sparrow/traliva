#include "api_native.h"
#include <QProcess>
#include <QWebView>
#include <QWebFrame>
#include <QDebug>
#include <QTextStream>
#include <QDir>
#include <QMessageBox>//

//static QProcess *CHILD_PROCESS = 0;

extern QString M_APPDIR;

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
    process->setWorkingDirectory(M_APPDIR);
    connect(process, SIGNAL(finished(int)), this, SLOT(playerFinished(int)));
    if (processByInputFunctionMap.contains("setToPlayer"))
        return -1;
    processByInputFunctionMap.insert("setToPlayer", process);
    connect(process, SIGNAL(readyReadStandardOutput()), this, SLOT(onReadyReadStandardOutput()));//%%%%
    QString pa = QString("%1/play.sh").arg(M_APPDIR);
    process->start(pa);
    QMessageBox::information(0, "ffffffffffffffffff", pa);
    //qDebug()<<"dsfghjkl;";
    return 0;
}

void ApiNative::setToPlayer(const QString &p)
{
    QMessageBox::information(0, "ffffffffffffffffff", p);
    QProcess *process = processByInputFunctionMap.value("setToPlayer");
    QTextStream ts(process);
    ts.setCodec("utf8");
    ts << p;
}

void ApiNative::playerChanged(const char *)
{
    //
}

void ApiNative::playerFinished(int p_exitCode)
{
    const QString funcName = "playerFinished";
    QString str = QString("api.%1(%2);").arg(funcName).arg(p_exitCode);
    webView->page()->mainFrame()->evaluateJavaScript(str);
    processByInputFunctionMap.remove("setToPlayer");
}

void ApiNative::onReadyReadStandardOutput()
{
    QProcess *process = (QProcess *)(sender());
    QTextStream ts(process);
    ts.setCodec("utf8");
    const QString funcName = "playerChanged";
    while(!ts.atEnd())
    {
        QString str = QString(ts.readLine().constData())
                .replace('\n', "")
                .replace('\'', "\\\'")
                .replace('\"', "\\\"")
                ;
        str = QString("api.%1(\'%2\');").arg(funcName).arg(str);
        webView->page()->mainFrame()->evaluateJavaScript(str);
    }
    return;
}
