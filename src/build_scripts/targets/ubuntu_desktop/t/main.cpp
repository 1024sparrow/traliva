#include <QApplication>
#include <QWebView>
#include <QWebFrame>[ code here: splash_0 ]
#include <QProcess>
#include <QDebug>//

#include <stdio.h>
//#include <libgen.h>
#include <QFile>
#include <QDir>
#include <QFileInfo>
#include <QTemporaryFile>

#include "main.h"
#include "api_native.h"

const QString M_APPNAME = "qt4webkit"; // переименуйте на то, что вам надо
QString M_APPDIR;

int main(int argc, char **argv)
{
    QApplication app(argc, argv);[ code here: icon ]
    bool ok = false;
    Main main(argc, argv, ok);
    return ok ? app.exec() : -1;
}

Main::Main(int argc, char **argv, bool &ok)
    :QObject(0)
{
    Q_UNUSED(argc);
    Q_UNUSED(argv);
    //{{
    QTemporaryFile tmpFile, tmpFileArchieve;
    tmpFile.setFileTemplate(QString("%1/%2.XXXXXX").arg(QDir::tempPath()).arg(M_APPNAME));
    tmpFileArchieve.setFileTemplate(QString("%1/%2.XXXXXX.tar.gz").arg(QDir::tempPath()).arg(M_APPNAME));
    if (!tmpFile.open())
    {
        fprintf(stderr, "error 10\n");
        return;
    }
    if (!tmpFileArchieve.open())
    {
        fprintf(stderr, "error 20\n");
        return;
    }
    QFileInfo tmpFileInfo(tmpFile);
    tmpScriptsDirPath = tmpFileInfo.fileName();
    M_APPDIR = QDir::temp().absoluteFilePath(tmpScriptsDirPath);
    QFileInfo tmpFileArchieveInfo(tmpFileArchieve);
    tmpFile.close();
    tmpFileArchieve.close();
    QFile fileArchieve(":/binutils.tar.gz");
    const QString tmpFileArchieveFullPath = QDir::temp().absoluteFilePath(tmpFileArchieveInfo.fileName());
    if (!QDir::temp().remove(tmpFileArchieveInfo.fileName()))
    {
        qDebug()<<"error 30";
        return;
    }
    if (!fileArchieve.copy(tmpFileArchieveFullPath))
    {
        fprintf(stderr, "Не могу скопировать архив из ресурсов во временный файл\n");
        qDebug() << "error 40: " << fileArchieve.errorString();
        return;
    }

    QDir tmpDir = QDir::temp();
    if (!tmpDir.remove(tmpScriptsDirPath))
    {
        //fprintf(stderr, "Не могу удалить временный файл, чтобы вместо него создать директорию\n");
        fprintf(stderr, "error 50\n");
        return;
    }
    if (!QDir::temp().mkdir(tmpScriptsDirPath)) // <-- надо сохранить путь, по которому при закрытии надо будет удалить директорию
    {
        //fprintf(stderr, "Не смог создать временную директорию под нативные скрипты & утилиты\n");
        fprintf(stderr, "error 60\n");
        return;
    }
    QProcess tarProcess;
    tarProcess.setWorkingDirectory(M_APPDIR);
    tarProcess.start("tar", QStringList()<<"-xf"<<tmpFileArchieve.fileName());
    tarProcess.waitForFinished();
    //}}
    [ code here: splash_1 ]
    wv = new QWebView();
    wv->setWindowTitle(M_APPNAME);
    wv->page()->mainFrame()->addToJavaScriptWindowObject("TralivaApi", new ApiNative(wv));
    connect(wv, SIGNAL(loadFinished(bool)), this, SLOT(onLoadFinished(bool)));
    wv->load(QUrl("qrc:///web_content/index.html"));
    ok = true;
}

Main::~Main()
{
    QProcess tarProcess;
    tarProcess.setWorkingDirectory(M_APPDIR);
    tarProcess.start("rm", QStringList()<<"-rf"<<QDir::temp().absoluteFilePath(tmpScriptsDirPath));
    tarProcess.waitForFinished();
}

void Main::onLoadFinished(bool p_ok)
{[ code here: splash_2 ]
    if (!p_ok)
    {
        fprintf(stderr, "internal error (web content)\n");
        qApp->exit(-1);
    }
    wv->show();
}
