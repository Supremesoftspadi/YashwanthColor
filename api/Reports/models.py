from django.db import models


class MaParty(models.Model):
    """Master Party table"""
    pacode = models.CharField(max_length=50, primary_key=True, db_column='PaCode')
    paname = models.CharField(max_length=500, db_column='PaName')
    pacity = models.CharField(max_length=200, db_column='PaCity', blank=True, null=True)

    class Meta:
        db_table = 'MaParty'
        managed = False  # Table already exists in SQL Server

    def __str__(self):
        return f"{self.pacode} - {self.paname}"


class TrInvoiceMain(models.Model):
    """Transaction Invoice Main table"""
    invno = models.CharField(max_length=50, db_column='InvNo')
    invyearcode = models.CharField(max_length=20, db_column='InvYearCode')
    invtype = models.CharField(max_length=20, db_column='InvType')
    pacode = models.CharField(max_length=50, db_column='Pacode')
    invdate = models.DateField(db_column='InvDate')
    invgrandtotal = models.FloatField(db_column='InvGrandTotal', default=0)
    invempno = models.IntegerField(db_column='InvEmpNo')
    einvstatus = models.CharField(
        max_length=50, db_column='Einvstatus', blank=True, null=True
    )

    class Meta:
        db_table = 'TrInvoiceMain'
        managed = False

    def __str__(self):
        return f"Invoice {self.invno} - {self.pacode}"


class TrOpeningBalNew(models.Model):
    """Transaction Opening Balance table"""
    pacode = models.CharField(max_length=50, db_column='Pacode')
    invamt = models.FloatField(db_column='InvAmt', default=0)
    invempno = models.IntegerField(db_column='InvEmpNo')
    entrydate = models.DateField(db_column='EntryDate')
    invdate = models.DateField(db_column='InvDate', blank=True, null=True)

    class Meta:
        db_table = 'TrOpeningBalNew'
        managed = False

    def __str__(self):
        return f"Opening Balance - {self.pacode}"


class TrPayCollMain(models.Model):
    """Payment Collection Main table"""
    payentryno = models.CharField(max_length=50, primary_key=True, db_column='PayEntryNo')
    payyearcode = models.CharField(max_length=20, db_column='PayYearCode')
    paydate = models.DateField(db_column='PayDate')

    class Meta:
        db_table = 'TrPayCollMain'
        managed = False

    def __str__(self):
        return f"Payment {self.payentryno}"


class TrPayCollSub(models.Model):
    """Payment Collection Sub table"""
    payentryno = models.CharField(max_length=50, db_column='PayEntryNo')
    payyearcode = models.CharField(max_length=20, db_column='PayYearCode')
    invno = models.CharField(max_length=50, db_column='InvNo')
    invyearcode = models.CharField(max_length=20, db_column='InvYearCode')
    invtype = models.CharField(max_length=20, db_column='InvType')
    payamount = models.FloatField(db_column='PayAmount', default=0)

    class Meta:
        db_table = 'TrPayCollSub'
        managed = False

    def __str__(self):
        return f"Pay Sub {self.payentryno}"
