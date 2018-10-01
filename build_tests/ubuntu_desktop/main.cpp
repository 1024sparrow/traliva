#include <QApplication>
#include <QWebView>
#include <QWebFrame>
#include <QPixmap>
#include <QSplashScreen>
#include <QBitmap>
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
    QApplication app(argc, argv);
    app.setWindowIcon(QIcon(":/icon.png"));
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
        fprintf(stderr, "Не смог открыть временный файл\n");
        qApp->exit(-1);
    }
    if (!tmpFileArchieve.open())
    {
        fprintf(stderr, "Не смог открыть временный файл (с архивом)\n");
        qApp->exit(-1);
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
        qDebug()<<"error while tmp dir removing 2";
        return;
    }
    if (!fileArchieve.copy(tmpFileArchieveFullPath))
    {
        fprintf(stderr, "Не могу скопировать архив из ресурсов во временный файл\n");
        qDebug() << "file operation error: " << fileArchieve.errorString();
        return;
    }

    QDir tmpDir = QDir::temp();
    if (!tmpDir.remove(tmpScriptsDirPath))
    {
        fprintf(stderr, "Не могу удалить временный файл, чтобы вместо него создать директорию\n");
        return;
    }
    if (!QDir::temp().mkdir(tmpScriptsDirPath)) // <-- надо сохранить путь, по которому при закрытии надо будет удалить директорию
    {
        fprintf(stderr, "Не смог создать временную директорию под нативные скрипты & утилиты\n");
        return;
    }
    QProcess tarProcess;
    tarProcess.setWorkingDirectory(M_APPDIR);
    tarProcess.start("tar", QStringList()<<"-xf"<<tmpFileArchieve.fileName());
    tarProcess.waitForFinished();
    //}}

    QPixmap pix(":/splash.png");
    splashScreen = new QSplashScreen(pix);
    splashScreen->setMask(pix.mask());
    //splashScreen->show(); // раскомментируйте, если загрузка может быть долгой

    wv = new QWebView();
    wv->setWindowTitle(M_APPNAME);
    wv->page()->mainFrame()->addToJavaScriptWindowObject("TralivaApi", new ApiNative(wv));
    connect(wv, SIGNAL(loadFinished(bool)), this, SLOT(onLoadFinished(bool)));
    wv->load(QUrl("qrc:///web_content/index.html"));
    ok = true;
}

Main::~Main()
{
    // boris here: если директория не пуста, то не может удалить (согласно документации по QDir::rmdir())
    if (!QDir::temp().rmdir(tmpScriptsDirPath))
    {
        qDebug()<<"removing: "<<QDir::tempPath() << " *(*" << tmpScriptsDirPath<<":"<< QDir::temp().;
        qDebug()<<"error while tmp dir removing";
    }
}

void Main::onLoadFinished(bool p_ok)
{
    splashScreen->finish(wv);
    wv->show();
}
